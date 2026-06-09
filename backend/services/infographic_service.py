import os
import traceback
import base64
import uuid
import time
from typing import Optional, Dict, Any
from datetime import datetime
from pathlib import Path

import requests
from openai import OpenAI

from services.supabase_client import supabase
from services.content_queue_service import get_content_by_id, update_content


# Configure OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Ensure upload directory exists
UPLOAD_DIR = Path("uploads/infographics")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _generate_prompt(trend_title: str, hook: str, linkedin_post: str, infographic_prompt: str) -> str:
    base_prompt = infographic_prompt or f"Professional LinkedIn infographic about {trend_title}"
    prompt = f"""You are an award-winning SaaS marketing designer creating viral LinkedIn infographics.

Create a premium, scroll-stopping infographic based on the content provided.

The objective is NOT to convert the article into text inside an image.

The objective is to communicate the core insight visually so users stop scrolling and become curious enough to read the LinkedIn post.

## Design Principles

* Modern SaaS startup aesthetic
* Enterprise-grade quality
* Looks like it was designed in Figma or Canva Pro
* Highly visual
* Minimal text
* Strong visual hierarchy
* Bold typography
* Plenty of whitespace
* Professional vector illustrations
* Clean iconography
* High contrast
* Premium color palette
* Soft gradients and subtle shadows
* Rounded cards and modern UI components

## Layout

Do NOT follow a fixed template.

Randomly choose one of these layouts each generation:

* Before vs After comparison
* 3 Key Statistics
* Timeline
* Step-by-step workflow
* Pyramid
* Circular process
* Dashboard style
* Hero statement with supporting cards
* Checklist
* Problem → Solution
* Myth vs Fact
* AI Process Flow
* Business Impact
* 2-column comparison
* Feature highlight cards
* KPI dashboard
* Quote + Insights
* Framework diagram
* Executive summary
* Strategy map

Each infographic should feel unique.

## Content Rules

Extract only the most important insight.

Never place more than 20-30 words in any single section.

Replace paragraphs with:

* icons
* numbers
* percentages
* arrows
* visual cards
* comparison blocks
* charts
* badges
* callouts
* highlights

Summarize information visually.

Do not create article screenshots.

Do not render long paragraphs.

Do not fill the image with text.

## Typography

Use:

* One large attention-grabbing headline
* One supporting subtitle
* 3–6 concise visual blocks
* One strong CTA

Text should be readable on mobile.

## Visual Elements

Use modern illustrations related to:

* Artificial Intelligence
* Legal Technology
* Compliance
* Contracts
* Automation
* Business
* Enterprise Software
* Workflow
* Productivity
* Data
* Security

Include abstract shapes and subtle background elements to create depth.

## Branding

Keep branding subtle.

Optionally include a small "LawGPT" logo or brand mark.

Do not make branding dominate the design.

## Goal

The infographic should make someone stop scrolling for 3–5 seconds because it looks premium and valuable.

It should create curiosity that encourages reading the LinkedIn caption.

The infographic should feel like content from top SaaS companies such as Notion, HubSpot, Stripe, Linear, Figma, or Canva.

## Content to Visualize

Title:
{trend_title}

Main Insight:
{hook}

Key Content:
{linkedin_post}

## Output

Generate a single polished 1080×1080 LinkedIn infographic.

Prioritize visual storytelling over written content.

Every generated infographic should have a noticeably different composition, layout, and visual style while maintaining a consistent premium SaaS aesthetic."""
    return prompt


def _save_local_image(image_bytes: bytes, content_id: int) -> str:
    """Save image to local uploads directory and return full HTTP URL"""
    try:
        filename = f"{content_id}.png"
        filepath = UPLOAD_DIR / filename
        
        print(f"[INFOGRAPHIC] Saved file: {filepath}")
        
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        
        # Return full HTTP URL (not filesystem path)
        public_url = f"http://localhost:8000/uploads/infographics/{filename}"
        print(f"[INFOGRAPHIC] Public URL: {public_url}")
        
        return public_url
    except Exception as e:
        print(f"[infographic_service] Error saving local image: {e}")
        raise


def _upload_to_supabase(image_bytes: bytes, filename: str) -> str:
    try:
        bucket_name = "infographics"
        file_path = f"generated/{filename}"

        print(f"[infographic_service] uploading to Supabase: bucket={bucket_name} path={file_path} bytes={len(image_bytes)}")

        response = supabase.storage.from_(bucket_name).upload(
            file_path,
            image_bytes,
            {"content-type": "image/png"}
        )

        print("[infographic_service] supabase.storage.upload response:", getattr(response, 'error', None))

        public = supabase.storage.from_(bucket_name).get_public_url(file_path)
        print("[infographic_service] public url:", public)

        # get_public_url returns dict with 'publicUrl' or similar depending on client
        if isinstance(public, dict):
            # supabase-py returns {'publicUrl': '...'} in some versions
            url = public.get('publicUrl') or public.get('public_url') or str(public)
        else:
            url = str(public)

        return url
    except Exception as e:
        print(f"[infographic_service] Error uploading to Supabase: {e}")
        raise


def generate_infographic_for_content(content_id: int, force: bool = False) -> Dict[str, Any]:
    """Main orchestration: validate content, check cache, call OpenAI, upload image, update DB, return URL."""
    try:
        print("========== INFOGRAPHIC GENERATION START ==========")
        print(f"CONTENT ID: {content_id}")
        print(f"FORCE REGENERATE: {force}")

        # Log OpenAI API key existence
        print(f"OPENAI_API_KEY EXISTS: {bool(client.api_key)}")
        print(f"OPENAI_API_KEY LENGTH: {len(client.api_key) if client.api_key else 0}")

        # Fetch content row
        print("========== FETCHING CONTENT ==========")
        row = get_content_by_id(content_id)
        if not row:
            print(f"[infographic_service] content id={content_id} not found")
            raise ValueError("content_not_found")

        print(f"[infographic_service] content row: {row}")

        # Check cache if not forcing regenerate
        print("========== CHECKING CACHE ==========")
        if not force and row.get('infographic_url'):
            print("========== CACHE HIT ==========")
            print(f"Existing infographic_url: {row.get('infographic_url')}")
            return {
                "success": True,
                "image_url": row.get('infographic_url'),
                "cached": True
            }

        print("========== CACHE MISS - GENERATING NEW IMAGE ==========")

        payload = row.get('payload') or {}
        if not isinstance(payload, dict):
            payload = {}

        trend_title = payload.get('trend_title') or payload.get('title') or ''
        hook = row.get('hook') or ''
        linkedin_post = row.get('generated_post') or row.get('linkedin_post') or ''
        infographic_prompt = payload.get('infographic_prompt') or ''

        print("========== GENERATING PROMPT ==========")
        prompt = _generate_prompt(trend_title, hook, linkedin_post, infographic_prompt)
        print(f"GENERATED PROMPT (full): {prompt}")
        print(f"GENERATED PROMPT (truncated): {prompt[:300]}...")

        # Validate OpenAI key
        if not client.api_key:
            print("[infographic_service] OPENAI_API_KEY missing")
            raise EnvironmentError("OPENAI_API_KEY not configured")

        # Call OpenAI Images API
        print("========== CALLING OPENAI IMAGE GENERATION ==========")
        print("OPENAI MODEL: gpt-image-1")
        try:
            print("[infographic_service] calling OpenAI images.generate")
            response = client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                size="1024x1024"
            )
            print("[infographic_service] openai response received")
            print(f"[infographic_service] response: {response}")
            print(f"[infographic_service] response.data: {response.data}")
            print(f"[infographic_service] response.data[0]: {response.data[0]}")
            print(f"[infographic_service] response.data[0] type: {type(response.data[0])}")
        except Exception as e:
            print(f"[infographic_service] OpenAI API call FAILED: {e}")
            print(f"[infographic_service] Exception type: {type(e).__name__}")
            import traceback
            print(f"[infographic_service] Traceback: {traceback.format_exc()}")
            raise

        # Extract image bytes: support both b64_json and external URL
        print("========== EXTRACTING IMAGE DATA ==========")
        image_bytes: Optional[bytes] = None
        image_url: Optional[str] = None
        try:
            img = response.data[0]
            print(f"[infographic_service] hasattr(img, 'b64_json'): {hasattr(img, 'b64_json')}")
            print(f"[infographic_service] hasattr(img, 'url'): {hasattr(img, 'url')}")
            
            if hasattr(img, "b64_json") and img.b64_json:
                print("[infographic_service] Found b64_json in response")
                image_bytes = base64.b64decode(img.b64_json)
                print(f"[infographic_service] Image length: {len(image_bytes)}")
            elif hasattr(img, "url") and img.url:
                print(f"[infographic_service] Found url in response: {img.url}")
                img_resp = requests.get(img.url)
                img_resp.raise_for_status()
                image_bytes = img_resp.content
                print(f"[infographic_service] Image length: {len(image_bytes)}")
            else:
                print(f"[infographic_service] No image data found in response")
                print(f"[infographic_service] Full img object: {img}")
                print(f"[infographic_service] img.__dict__: {img.__dict__ if hasattr(img, '__dict__') else 'N/A'}")
                raise RuntimeError(f"No image found in response: {img}")
        except Exception as e:
            print(f"[infographic_service] Error extracting image from OpenAI response: {e}")
            import traceback
            print(f"[infographic_service] Traceback: {traceback.format_exc()}")
            raise

        if not image_bytes:
            print("[infographic_service] image_bytes is None after extraction")
            raise RuntimeError("Failed to obtain image bytes from OpenAI response")

        print(f"[infographic_service] image_bytes length: {len(image_bytes)}")

        # Save image to local file
        print("========== SAVING IMAGE ==========")
        filename = f"{content_id}.png"
        filepath = UPLOAD_DIR / filename
        print(f"[INFOGRAPHIC] Saved file: {filepath}")
        
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        
        # Return full HTTP URL (not filesystem path)
        public_url = f"http://localhost:8000/uploads/infographics/{filename}"
        print(f"[INFOGRAPHIC] Public URL: {public_url}")

        # Persist to DB
        print("========== SAVING TO DATABASE ==========")
        try:
            print(f"[infographic_service] updating content_queue id={content_id} with infographic data")
            update_data = {
                "infographic_url": public_url,
                "infographic_prompt": prompt,
                "image_generated_at": datetime.utcnow().isoformat()
            }
            print(f"[INFOGRAPHIC] DB updated: {update_data}")
            update_result = update_content(content_id, update_data)
            print("[infographic_service] update_result:", update_result)
            print("========== SAVE SUCCESS ==========")
        except Exception as e:
            print(f"[infographic_service] Failed to update DB with infographic data: {e}")
            print("========== SAVE FAILED ==========")
            import traceback
            print(f"[infographic_service] Traceback: {traceback.format_exc()}")
            raise

        print("========== IMAGE SAVED ==========")
        print(f"[INFOGRAPHIC] Returning URL: {public_url}")

        return {
            "success": True,
            "infographic_url": public_url
        }

    except Exception as e:
        print(f"[infographic_service] EXCEPTION CAUGHT: {e}")
        print(f"[infographic_service] Exception type: {type(e).__name__}")
        import traceback
        print(f"[infographic_service] Full traceback:")
        print(traceback.format_exc())
        # re-raise for the router to map to HTTP errors
        raise

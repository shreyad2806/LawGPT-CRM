import os
import traceback
import base64
import uuid
import time
from typing import Optional

import requests
import openai

from services.supabase_client import supabase
from services.content_queue_service import get_content_by_id, update_content


# Configure OpenAI key from env
openai.api_key = os.environ.get("OPENAI_API_KEY")


def _generate_prompt(trend_title: str, hook: str, linkedin_post: str, infographic_prompt: str) -> str:
    base_prompt = infographic_prompt or f"Professional LinkedIn infographic about {trend_title}"
    prompt = f"{base_prompt}\n\nTitle: {trend_title}\nHook: {hook}\nContent: {linkedin_post[:400]}"
    return prompt


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


def generate_infographic_for_content(content_id: int) -> str:
    """Main orchestration: validate content, call OpenAI, upload image, update DB, return URL."""
    try:
        print(f"[infographic_service] generate_infographic_for_content start id={content_id}")

        # Fetch content row
        row = get_content_by_id(content_id)
        if not row:
            print(f"[infographic_service] content id={content_id} not found")
            raise ValueError("content_not_found")

        print(f"[infographic_service] content row: {row}")

        payload = row.get('payload') or {}
        if not isinstance(payload, dict):
            payload = {}

        trend_title = payload.get('trend_title') or payload.get('title') or ''
        hook = row.get('hook') or ''
        linkedin_post = row.get('generated_post') or ''
        infographic_prompt = payload.get('infographic_prompt') or ''

        prompt = _generate_prompt(trend_title, hook, linkedin_post, infographic_prompt)
        print(f"[infographic_service] prompt (truncated): {prompt[:300]}...")

        # Validate OpenAI key
        if not openai.api_key:
            print("[infographic_service] OPENAI_API_KEY missing")
            raise EnvironmentError("OPENAI_API_KEY not configured")

        # Call OpenAI Images API
        try:
            print("[infographic_service] calling OpenAI images.create")
            response = openai.Image.create(
                prompt=prompt,
                n=1,
                size="1024x1024"
            )
            print("[infographic_service] openai response keys:", list(response.__dict__.keys()) if hasattr(response, '__dict__') else type(response))
        except Exception as e:
            print(f"[infographic_service] OpenAI API call failed: {e}")
            raise

        # Extract image bytes: support both b64_json and external URL
        image_bytes: Optional[bytes] = None
        try:
            data0 = response.data[0]
            # prefer base64
            b64 = getattr(data0, 'b64_json', None) or data0.get('b64_json') if isinstance(data0, dict) else None
            url = getattr(data0, 'url', None) or (data0.get('url') if isinstance(data0, dict) else None)

            if b64:
                print("[infographic_service] received b64 image from OpenAI")
                image_bytes = base64.b64decode(b64)
            elif url:
                print(f"[infographic_service] received remote url from OpenAI: {url}, fetching")
                img_resp = requests.get(url)
                img_resp.raise_for_status()
                image_bytes = img_resp.content
            else:
                # Some responses may embed bytes differently
                print("[infographic_service] No b64_json or url found in OpenAI response, attempting to parse")
                # try to stringify and error
                raise RuntimeError("No image data in OpenAI response")
        except Exception as e:
            print(f"[infographic_service] Error extracting image from OpenAI response: {e}")
            raise

        if not image_bytes:
            raise RuntimeError("Failed to obtain image bytes from OpenAI response")

        # Upload to Supabase
        filename = f"infographic_{content_id}_{uuid.uuid4().hex}.png"
        supabase_url = _upload_to_supabase(image_bytes, filename)

        print(f"[infographic_service] uploaded infographic, public_url={supabase_url}")

        # Persist to DB
        try:
            print(f"[infographic_service] updating content_queue id={content_id} with infographic_url")
            update_result = update_content(content_id, {"infographic_url": supabase_url})
            print("[infographic_service] update_result:", update_result)
        except Exception as e:
            print(f"[infographic_service] Failed to update DB with infographic_url: {e}")
            raise

        return supabase_url

    except Exception as e:
        print(f"[infographic_service] Exception: {e}")
        print(traceback.format_exc())
        # re-raise for the router to map to HTTP errors
        raise

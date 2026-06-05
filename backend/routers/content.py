from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from services.content_queue_service import get_content, create_content, update_content
from services.infographic_service import generate_infographic_for_content

router = APIRouter()

class ContentItem(BaseModel):
    hook: str
    cta: str
    platform: str
    status: str
    created: str

class CreateContentRequest(BaseModel):
    hook: str
    cta: str
    platform: str

@router.get("/")
async def get_all_content() -> Dict[str, Any]:
    """Get all content items"""
    print("[routers.content] get_all_content called")
    content_items = get_content()

    print("[routers.content] get_content returned rows:", len(content_items))

    transformed_content: List[Dict[str, Any]] = []

    for item in content_items:
        # Log raw row for debugging
        print("[routers.content] RAW SUPABASE ROW:", item)

        payload = item.get("payload", {}) or {}
        if not isinstance(payload, dict):
            payload = {}

        # Debug: inspect where linkedin post lives
        print("=" * 80)
        print("RAW ROW")
        print(item)
        print("TOP LEVEL linkedin_post:", item.get("linkedin_post"))
        print("TOP LEVEL generated_post:", item.get("generated_post"))
        print("PAYLOAD linkedin_post:", payload.get("linkedin_post"))
        print("PAYLOAD generated_post:", payload.get("generated_post"))
        print("PAYLOAD post:", payload.get("post"))
        print("=" * 80)

        # Prefer top-level columns first, then payload keys, considering several possible field names
        linkedin_post = (
            item.get("linkedin_post")
            or item.get("generated_post")
            or payload.get("linkedin_post")
            or payload.get("generated_post")
            or payload.get("post")
            or ""
        )

        trend_id = item.get("trend_id") or payload.get("trend_id") or ""
        trend_title = (
            item.get("trend_title")
            or payload.get("trend_title")
            or payload.get("title")
            or ""
        )
        cta = item.get("cta") or payload.get("cta") or ""
        hashtags = payload.get("hashtags") or item.get("hashtags") or []
        infographic_prompt = payload.get("infographic_prompt") or item.get("infographic_prompt") or ""

        transformed = {
            "id": str(item.get("id", "")),
            "trend_id": trend_id,
            "trend_title": trend_title,
            "hook": item.get("hook", ""),
            "linkedin_post": linkedin_post,
            "cta": cta,
            "hashtags": hashtags,
            "infographic_prompt": infographic_prompt,
            "infographic_url": item.get("infographic_url"),
            "status": item.get("status", "Draft"),
            "created_at": item.get("created_at", "") if item.get("created_at") else ""
        }

        print("[routers.content] API RESPONSE ITEM:", transformed)

        transformed_content.append(transformed)

    return {"content": transformed_content}

@router.post("/")
async def create_content_route(request: CreateContentRequest) -> Dict[str, Any]:
    """Create new content item"""
    content_data = {
        "hook": request.hook,
        "cta": request.cta,
        "platform": request.platform,
        "status": "Draft"
    }

    print("[routers.content] create_content called with:", content_data)
    # call service create_content (imported at module top)
    result = create_content(content_data)

    print("[routers.content] create_content result:", result)

    if result and len(result) > 0:
        created_item = result[0]
        return {
            "id": str(created_item.get("id", "")),
            "hook": created_item.get("hook", request.hook),
            "cta": created_item.get("cta", request.cta),
            "platform": created_item.get("platform", request.platform),
            "status": created_item.get("status", "Draft"),
            "created": created_item.get("created_at", "") if created_item.get("created_at") else ""
        }

    return {
        "id": "new_id",
        "hook": request.hook,
        "cta": request.cta,
        "platform": request.platform,
        "status": "Draft",
        "created": ""
    }


@router.patch("/{content_id}")
async def patch_content(content_id: int, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update a content item"""
    print(f"[routers.content] patch_content called id={content_id} updates={updates}")
    result = update_content(content_id, updates)

    print("[routers.content] update_content result:", result)

    if result and len(result) > 0:
        updated = result[0]
        payload = updated.get("payload", {}) or {}
        if not isinstance(payload, dict):
            payload = {}

        # Determine linkedin_post from updated row (top-level or payload)
        updated_linkedin_post = (
            updated.get("linkedin_post")
            or updated.get("generated_post")
            or payload.get("linkedin_post")
            or payload.get("generated_post")
            or payload.get("post")
            or ""
        )

        return {
            "id": str(updated.get("id", "")),
            "trend_id": payload.get("trend_id") or "",
            "trend_title": payload.get("trend_title") or payload.get("title") or "",
            "hook": updated.get("hook", ""),
            "linkedin_post": updated_linkedin_post,
            "cta": updated.get("cta", ""),
            "hashtags": payload.get("hashtags", []),
            "infographic_prompt": payload.get("infographic_prompt", ""),
            "infographic_url": updated.get("infographic_url"),
            "status": updated.get("status", ""),
            "created_at": updated.get("created_at", "") if updated.get("created_at") else ""
        }

    return {"error": "update failed"}





@router.post("/{content_id}/generate-infographic")
async def generate_infographic_for_content_route(content_id: int) -> Dict[str, Any]:
    """Backward-compatible endpoint under /api/content/{id}/generate-infographic"""
    try:
        print(f"[routers.content] generate-infographic called id={content_id}")
        try:
            url = generate_infographic_for_content(content_id)
        except ValueError:
            raise HTTPException(status_code=404, detail="Content not found")
        except EnvironmentError as ee:
            print(f"[routers.content] env error: {ee}")
            raise HTTPException(status_code=500, detail=str(ee))
        except Exception as e:
            print(f"[routers.content] generation error: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate infographic")

        return {"infographic_url": url}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[routers.content] unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats")
async def get_content_stats() -> Dict[str, Any]:
    """Get content statistics"""
    content_items = get_content()

    drafts = 0
    approved = 0
    rejected = 0
    posted = 0

    for item in content_items:
        status = item.get("status", "").lower()
        if status == "draft":
            drafts += 1
        elif status == "approved":
            approved += 1
        elif status == "rejected":
            rejected += 1
        elif status == "posted":
            posted += 1

    return {
        "drafts": drafts,
        "approved": approved,
        "rejected": rejected,
        "posted": posted
    }

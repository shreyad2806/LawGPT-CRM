from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel
from services.content_queue_service import get_content, create_content, update_content

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
    content_items = get_content()

    # Transform database fields to match frontend schema
    transformed_content = []
    for item in content_items:
        transformed_content.append({
            "id": str(item.get("id", "")),
            "hook": item.get("hook", ""),
            "cta": item.get("cta", ""),
            "platform": item.get("platform", "LinkedIn"),
            "status": item.get("status", "Draft"),
            "created": item.get("created_at", "") if item.get("created_at") else ""
        })

    return {"content": transformed_content}

@router.post("/")
async def create_content(request: CreateContentRequest) -> Dict[str, Any]:
    """Create new content item"""
    content_data = {
        "hook": request.hook,
        "cta": request.cta,
        "platform": request.platform,
        "status": "Draft"
    }

    result = create_content(content_data)

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

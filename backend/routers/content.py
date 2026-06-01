from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel

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
    return {
        "content": [
            {
                "id": "1",
                "hook": "Most lawyers still review contracts manually",
                "cta": "Learn how AI can help",
                "platform": "LinkedIn",
                "status": "Draft",
                "created": "2024-01-15"
            },
            {
                "id": "2",
                "hook": "GDPR fines hit €42B in 2024",
                "cta": "Check your compliance",
                "platform": "LinkedIn",
                "status": "Approved",
                "created": "2024-01-14"
            },
            {
                "id": "3",
                "hook": "3 hidden risks in employment contracts",
                "cta": "Protect your business",
                "platform": "Carousel",
                "status": "Draft",
                "created": "2024-01-13"
            }
        ]
    }

@router.post("/")
async def create_content(request: CreateContentRequest) -> Dict[str, Any]:
    """Create new content item"""
    return {
        "id": "new_id",
        "hook": request.hook,
        "cta": request.cta,
        "platform": request.platform,
        "status": "Draft",
        "created": "2024-01-16"
    }

@router.get("/stats")
async def get_content_stats() -> Dict[str, Any]:
    """Get content statistics"""
    return {
        "drafts": 142,
        "approved": 187,
        "rejected": 29,
        "posted": 384
    }

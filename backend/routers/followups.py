from fastapi import APIRouter
from typing import Dict, Any
from pydantic import BaseModel

router = APIRouter()

class FollowupItem(BaseModel):
    lead: str
    company: str
    type: str
    status: str
    scheduled: str
    preview: str

class CreateFollowupRequest(BaseModel):
    lead: str
    company: str
    type: str
    preview: str

@router.get("/")
async def get_all_followups() -> Dict[str, Any]:
    """Get all followups"""
    return {
        "followups": [
            {
                "id": "1",
                "lead": "Sarah Chen",
                "company": "Orrick LLP",
                "type": "Connection",
                "status": "Ready",
                "scheduled": "Today 10:00 AM",
                "preview": "Loved your recent post on AI compliance. Would love to connect."
            },
            {
                "id": "2",
                "lead": "Marcus Reyes",
                "company": "Latham & Watkins",
                "type": "Value Add",
                "status": "Pending",
                "scheduled": "Today 2:00 PM",
                "preview": "Sharing a recent report on legal automation trends."
            },
            {
                "id": "3",
                "lead": "Priya Nair",
                "company": "Freshfields",
                "type": "Case Study",
                "status": "Sent",
                "scheduled": "Yesterday",
                "preview": "We helped a legal team reduce contract review time by 60%."
            }
        ]
    }

@router.post("/")
async def create_followup(request: CreateFollowupRequest) -> Dict[str, Any]:
    """Create new followup"""
    return {
        "id": "new_id",
        "lead": request.lead,
        "company": request.company,
        "type": request.type,
        "status": "Pending",
        "scheduled": "Tomorrow",
        "preview": request.preview
    }

@router.get("/stats")
async def get_followups_stats() -> Dict[str, Any]:
    """Get followups statistics"""
    return {
        "pending": 63,
        "ready_to_send": 28,
        "sent": 847,
        "responded": 214
    }

from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel

router = APIRouter()

class LeadItem(BaseModel):
    name: str
    company: str
    role: str
    platform: str
    engagement: str
    score: int
    category: str
    status: str

class CreateLeadRequest(BaseModel):
    name: str
    company: str
    role: str
    platform: str
    profile_url: str

@router.get("/")
async def get_all_leads() -> Dict[str, Any]:
    """Get all leads"""
    return {
        "leads": [
            {
                "id": "1",
                "name": "Sarah Chen",
                "company": "Orrick LLP",
                "role": "Partner",
                "platform": "LinkedIn",
                "engagement": "High",
                "score": 92,
                "category": "Partner",
                "status": "Qualified"
            },
            {
                "id": "2",
                "name": "Marcus Reyes",
                "company": "Latham & Watkins",
                "role": "C-Level",
                "platform": "LinkedIn",
                "engagement": "Medium",
                "score": 88,
                "category": "C-Level",
                "status": "Qualified"
            },
            {
                "id": "3",
                "name": "Priya Nair",
                "company": "Freshfields",
                "role": "Associate",
                "platform": "Twitter/X",
                "engagement": "High",
                "score": 84,
                "category": "Associate",
                "status": "Review"
            }
        ]
    }

@router.post("/")
async def create_lead(request: CreateLeadRequest) -> Dict[str, Any]:
    """Create new lead"""
    return {
        "id": "new_id",
        "name": request.name,
        "company": request.company,
        "role": request.role,
        "platform": request.platform,
        "profile_url": request.profile_url,
        "score": 0,
        "status": "New"
    }

@router.get("/stats")
async def get_leads_stats() -> Dict[str, Any]:
    """Get leads statistics"""
    return {
        "total": 2847,
        "qualified": 1029,
        "pending": 1423,
        "rejected": 395
    }

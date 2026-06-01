from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats() -> Dict[str, Any]:
    """Get dashboard statistics"""
    return {
        "trends_analyzed": 2847,
        "content_generated": 384,
        "qualified_leads": 1029,
        "followups_pending": 63
    }

@router.get("/recent-content")
async def get_recent_content() -> Dict[str, Any]:
    """Get recent content items"""
    return {
        "recent_content": [
            {
                "id": "1",
                "hook": "Most lawyers still review contracts manually",
                "status": "Draft",
                "platform": "LinkedIn"
            },
            {
                "id": "2",
                "hook": "GDPR fines hit €42B in 2024",
                "status": "Approved",
                "platform": "LinkedIn"
            },
            {
                "id": "3",
                "hook": "3 hidden risks in employment contracts",
                "status": "Draft",
                "platform": "Carousel"
            }
        ]
    }

@router.get("/top-leads")
async def get_top_leads() -> Dict[str, Any]:
    """Get top qualified leads"""
    return {
        "top_leads": [
            {
                "id": "1",
                "name": "Sarah Chen",
                "company": "Orrick LLP",
                "score": 92
            },
            {
                "id": "2",
                "name": "Marcus Reyes",
                "company": "Latham & Watkins",
                "score": 88
            },
            {
                "id": "3",
                "name": "Priya Nair",
                "company": "Freshfields",
                "score": 84
            }
        ]
    }

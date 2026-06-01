from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel

router = APIRouter()

@router.get("/hashtags")
async def get_top_hashtags() -> Dict[str, Any]:
    """Get top performing hashtags"""
    return {
        "hashtags": [
            {"tag": "#LegalTech", "count": 234},
            {"tag": "#AI", "count": 189},
            {"tag": "#ContractReview", "count": 156},
            {"tag": "#Compliance", "count": 142},
            {"tag": "#LawFirm", "count": 128}
        ]
    }

@router.get("/performers")
async def get_best_performers() -> Dict[str, Any]:
    """Get best performing content"""
    return {
        "performers": [
            {
                "hook": "Most lawyers still review contracts manually",
                "engagement": "8.2% CTR",
                "platform": "LinkedIn"
            },
            {
                "hook": "GDPR fines hit €42B in 2024",
                "engagement": "7.8% CTR",
                "platform": "LinkedIn"
            },
            {
                "hook": "3 hidden risks in employment contracts",
                "engagement": "7.4% CTR",
                "platform": "Carousel"
            }
        ]
    }

@router.get("/engagement")
async def get_engagement_metrics() -> Dict[str, Any]:
    """Get engagement metrics"""
    return {
        "total_impressions": 125000,
        "total_likes": 8900,
        "total_comments": 1200,
        "total_shares": 450,
        "engagement_rate": 8.5
    }

@router.get("/trends")
async def get_content_trends() -> Dict[str, Any]:
    """Get content performance trends"""
    return {
        "trends": [
            {"date": "2024-01-10", "engagement": 7.2},
            {"date": "2024-01-11", "engagement": 7.8},
            {"date": "2024-01-12", "engagement": 8.1},
            {"date": "2024-01-13", "engagement": 8.5},
            {"date": "2024-01-14", "engagement": 8.2},
            {"date": "2024-01-15", "engagement": 8.9}
        ]
    }

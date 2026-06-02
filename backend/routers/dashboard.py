from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from api.dashboard import get_dashboard_stats as get_dashboard_stats_service
from services.content_queue_service import get_content
from services.lead_service import get_all_leads

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats() -> Dict[str, Any]:
    """Get dashboard statistics"""
    try:
        stats = get_dashboard_stats_service()

        # Transform camelCase to snake_case for frontend compatibility
        return {
            "trends_analyzed": stats.get("trendsAnalyzed", 0),
            "content_generated": stats.get("contentGenerated", 0),
            "qualified_leads": stats.get("qualifiedLeads", 0),
            "followups_pending": stats.get("followupsPending", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard stats: {str(e)}")

@router.get("/recent-content")
async def get_recent_content() -> Dict[str, Any]:
    """Get recent content items"""
    try:
        content_items = get_content(limit=5)

        # Transform database fields to match frontend schema
        recent_content = []
        for item in content_items:
            recent_content.append({
                "id": str(item.get("id", "")),
                "hook": item.get("hook", ""),
                "status": item.get("status", "Draft"),
                "platform": item.get("platform", "LinkedIn")
            })

        return {"recent_content": recent_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recent content: {str(e)}")

@router.get("/top-leads")
async def get_top_leads() -> Dict[str, Any]:
    """Get top qualified leads"""
    try:
        leads = get_all_leads()

        # Filter for qualified leads and sort by score
        qualified_leads = []
        for lead in leads:
            status = lead.get("status", "").lower()
            qualification_status = lead.get("qualification_status", "").lower()

            if status == "qualified" or qualification_status == "qualified":
                lead_score = lead.get("lead_score", 0) or lead.get("qualification_score", 0) or 0
                qualified_leads.append({
                    "id": str(lead.get("id", "")),
                    "name": lead.get("name", ""),
                    "company": lead.get("company", ""),
                    "score": int(lead_score)
                })

        # Sort by score descending and return top 5
        qualified_leads.sort(key=lambda x: x["score"], reverse=True)
        top_leads = qualified_leads[:5]

        return {"top_leads": top_leads}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch top leads: {str(e)}")

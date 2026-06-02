from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from services.followup_service import get_followups, save_followup, update_followup, delete_followup

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
    try:
        followups = get_followups()

        # Transform database fields to match frontend schema
        transformed_followups = []
        for item in followups:
            transformed_followups.append({
                "id": str(item.get("id", "")),
                "lead": f"Lead {item.get('lead_id', '')}",  # Placeholder - would need lead table join for actual name
                "company": "",  # Placeholder - would need lead table join for actual company
                "type": item.get("followup_type", ""),
                "status": item.get("status", "Pending"),
                "scheduled": item.get("scheduled_date", "") if item.get("scheduled_date") else "",
                "preview": item.get("followup_message", "")[:100] + "..." if item.get("followup_message") else ""
            })

        return {"followups": transformed_followups}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch followups: {str(e)}")

@router.post("/")
async def create_followup(request: CreateFollowupRequest) -> Dict[str, Any]:
    """Create new followup"""
    try:
        # Map frontend request to database schema
        followup_data = {
            "lead_id": 1,  # Placeholder - would need to resolve lead name to lead_id
            "followup_message": request.preview,
            "followup_type": request.type,
            "status": "Pending",
            "scheduled_date": "Tomorrow"  # Placeholder - would need actual date
        }

        result = save_followup(followup_data)

        if result and len(result) > 0:
            created_item = result[0]
            return {
                "id": str(created_item.get("id", "")),
                "lead": request.lead,
                "company": request.company,
                "type": created_item.get("followup_type", request.type),
                "status": created_item.get("status", "Pending"),
                "scheduled": created_item.get("scheduled_date", "Tomorrow") if created_item.get("scheduled_date") else "Tomorrow",
                "preview": created_item.get("followup_message", request.preview)
            }

        return {
            "id": "new_id",
            "lead": request.lead,
            "company": request.company,
            "type": request.type,
            "status": "Pending",
            "scheduled": "Tomorrow",
            "preview": request.preview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create followup: {str(e)}")

@router.get("/stats")
async def get_followups_stats() -> Dict[str, Any]:
    """Get followups statistics"""
    try:
        followups = get_followups()

        pending = 0
        ready_to_send = 0
        sent = 0
        responded = 0

        for item in followups:
            status = item.get("status", "").lower()
            if status == "pending":
                pending += 1
            elif status == "ready" or status == "ready_to_send":
                ready_to_send += 1
            elif status == "sent":
                sent += 1
            elif status == "responded":
                responded += 1

        return {
            "pending": pending,
            "ready_to_send": ready_to_send,
            "sent": sent,
            "responded": responded
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch followup stats: {str(e)}")

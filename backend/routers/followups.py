from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from services.followup_service import get_followups, get_followup, save_followup, update_followup, delete_followup
from services.followup_ai_service import generate_ai_reply, generate_ai_recommendation, generate_coaching_panel
from services.sdr_memory_service import get_conversation_memory, learn_successful_pattern
from services.lead_activity_service import (
    log_followup_status_updated, 
    log_reply_generated, 
    log_recommendation_generated,
    log_followup_completed
)
from services.engagement_logs_service import get_engagement_logs

router = APIRouter()

class FollowupUpdate(BaseModel):

    status: Optional[str] = None

    priority: Optional[str] = None

    next_action: Optional[str] = None

    generated_reply: Optional[str] = None

    followup_message: Optional[str] = None

from typing import Optional

def format_followup(
    item: Optional[Dict[str, Any]]
) -> Dict[str, Any]:

    if item is None:
        return {}

    lead = item.get("leads") or {}

    return {

        "id": item.get("id"),

        "lead_id": item.get("lead_id"),

        "lead_name":
            item.get("lead_name") or lead.get("name"),

        "company":
            item.get("company") or lead.get("company"),

        "role":
            lead.get("role"),

        "intent":
            item.get("intent"),

        "score":
            item.get("score", 0),

        "priority":
            item.get("priority", "Medium"),

        "status":
            item.get("status", "Pending"),

        "followup_type":
            item.get("followup_type"),

        "followup_message":
            item.get("followup_message"),

        "next_action":
            item.get("next_action"),

        "generated_reply":
            item.get("generated_reply"),

        "due_date":
            item.get("due_date"),

        "completed_at":
            item.get("completed_at"),

        "created_at":
            item.get("created_at")

    }
@router.get("/")
async def get_all_followups() -> Dict[str, Any]:
    """Get all followups"""
    try:
        print("[followups.py] GET /api/followups called")
        followups = get_followups()
        print(f"[followups.py] Raw followups from service: {len(followups)} items")
        print(f"[followups.py] Raw followups data: {followups}")
        
        transformed = [format_followup(item) for item in followups]
        print(f"[followups.py] Transformed followups: {len(transformed)} items")
        print(f"[followups.py] Transformed followups data: {transformed}")
        
        result = {"followups": transformed}
        print(f"[followups.py] Returning: {result}")
        return result
    except Exception as e:
        print(f"[followups.py] Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch followups: {str(e)}")

@router.get("/{id}")
async def get_single_followup(id: int) -> Dict[str, Any]:
    """Get a single followup"""
    try:
        followup = get_followup(id)
        if not followup:
            raise HTTPException(status_code=404, detail="Followup not found")
        return {"followup": format_followup(followup)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch followup: {str(e)}")

@router.patch("/{id}")
async def update_single_followup(id: int, request: FollowupUpdate) -> Dict[str, Any]:
    """Update a followup"""
    try:
        existing = get_followup(id)
        if not existing:
            raise HTTPException(status_code=404, detail="Followup not found")
            
        updates = {k: v for k, v in request.model_dump().items() if v is not None}
        if not updates:
            return {"followup": format_followup(existing)}
            
        updated = update_followup(id, updates)
        if not updated:
            raise HTTPException(status_code=500, detail="Failed to update followup")
            
        # Log status change if provided
        if request.status and request.status != existing.get("status"):
            log_followup_status_updated(existing["lead_id"], id, existing.get("status", ""), request.status)
            
        refreshed = get_followup(id)

        if refreshed is None:
            raise HTTPException(
        status_code=500,
        detail="Unable to reload followup"
    )
        
        return {
            "followup": format_followup(refreshed)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update followup: {str(e)}")

@router.delete("/{id}")
async def delete_single_followup(id: int) -> Dict[str, Any]:
    """Delete a followup"""
    try:
        success = delete_followup(id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete followup")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete followup: {str(e)}")

@router.post("/{id}/generate-reply")
async def generate_reply(id: int):

    followup = get_followup(id)

    if not followup:
        raise HTTPException(
            status_code=404,
            detail="Followup not found"
        )

    lead = followup.get("leads") or {}

    engagement_logs = get_engagement_logs()

    lead_logs = [
        x
        for x in engagement_logs
        if x.get("person_name") == lead.get("name")
    ]

    engagement_message = (
        lead_logs[0].get("message", "")
        if lead_logs
        else ""
    )

    generated_reply = generate_ai_reply(
        lead=lead,
        engagement_message=engagement_message,
        ai_summary=lead.get("reason", ""),
        intent=lead.get("intent", "")
    )

    print("========== GENERATED REPLY ==========")
    print(generated_reply)

    update_followup(
        id,
        {
            "generated_reply": generated_reply
        }
    )

    log_reply_generated(
        followup["lead_id"],
        id,
        generated_reply
    )

    refreshed = get_followup(id)

    if refreshed is None:
        raise HTTPException(
            status_code=500,
            detail="Unable to reload followup"
        )

    formatted = format_followup(refreshed)

    print("========== RETURNING ==========")
    print(formatted)

    return {
        "followup": formatted
    }
    
@router.post("/{id}/complete")
async def complete_followup(id:int):

    followup=get_followup(id)

    if not followup:

        raise HTTPException(404,"Followup not found")

    now=datetime.utcnow().isoformat()

    payload = {

    "status": "Completed",

    "completed_at": now

}

    print(payload)

    update_followup(id, payload)
    

    log_followup_completed(

        followup["lead_id"],

        {

            "action":followup.get("followup_type")

        }

    )
    
    refreshed = get_followup(id)
    if refreshed is None:
        raise HTTPException(
            status_code=500,
            detail="Unable to reload followup"
        )
        return {
            "followup": format_followup(refreshed)
            }
        

@router.get("/{id}/coaching")
async def get_coaching_panel(id: int) -> Dict[str, Any]:
    """Get AI coaching panel and conversation memory for a followup's lead"""
    try:
        followup = get_followup(id)
        if not followup:
            raise HTTPException(status_code=404, detail="Followup not found")
            
        from typing import cast

        lead = cast(Dict[str, Any], followup.get("leads") or {})

        lead_id = followup.get("lead_id")

        if lead_id is None:
         raise HTTPException(
        status_code=400,
        detail="Lead id missing from followup",
    )

        lead_id = int(lead_id)

        memory_records = get_conversation_memory(lead_id)
        history_text = "\n".join(
            f"{m.get('sender')}: {m.get('message')}"
            for m in memory_records
            )
        if not history_text:
            history_text = "No prior conversation memory."
    
        if not history_text:
            history_text = "No prior conversation memory."
            
        coaching_data = generate_coaching_panel(lead, history_text)
        
        return {
            "coaching": coaching_data,
            "conversation_memory": memory_records
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate coaching panel: {str(e)}")

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
            if status == "pending" or status == "needs response":
                pending += 1
            elif status == "ready" or status == "ready_to_send":
                ready_to_send += 1
            elif status == "sent" or status == "completed":
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

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from services.memory_service import get_lead_memory, get_conversation_history, store_conversation
from services.supabase_client import supabase

router = APIRouter()


@router.get("/{lead_id}")
async def get_memory(lead_id: int) -> Dict[str, Any]:
    """
    Get memory summary, conversation history, and events for a lead.
    """
    try:
        # Get lead memory summary
        summary = get_lead_memory(lead_id)

        # Get conversation history (last 10 messages)
        history = get_conversation_history(lead_id, limit=10)

        # Get memory events
        events_response = (
            supabase.table("memory_events")
            .select("*")
            .eq("lead_id", lead_id)
            .order("created_at", desc=True)
            .limit(20)
            .execute()
        )
        events = events_response.data or []

        return {
            "summary": summary or {},
            "history": history or [],
            "events": events or []
        }
    except Exception as e:
        print(f"[memory_router] Error getting memory: {e}")
        # Return empty data on error to avoid breaking followup workflow
        return {
            "summary": {},
            "history": [],
            "events": []
        }


@router.get("/test/{lead_id}")
async def test_memory(lead_id: int) -> Dict[str, Any]:
    """
    Test endpoint: Insert a test conversation and return the inserted row.
    """
    try:
        print("========== TEST MEMORY INSERT ==========")
        print(f"lead_id: {lead_id}")

        inserted = store_conversation(
            lead_id,
            "user",
            "test memory"
        )

        print("========== TEST INSERT RESULT ==========")
        print(inserted)

        return {
            "success": True,
            "inserted": inserted
        }
    except Exception as e:
        print(f"[memory_router] Error in test endpoint: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }

from typing import Any, Dict, List, Optional, cast

from services.supabase_client import supabase, safe_insert


def get_conversation_memory(lead_id: int) -> List[Dict[str, Any]]:
    """
    Get conversation history for a lead.
    """

    try:
        response = (
            supabase.table("conversation_memory")
            .select("*")
            .eq("lead_id", lead_id)
            .order("timestamp")
            .execute()
        )

        return cast(List[Dict[str, Any]], response.data or [])

    except Exception as e:
        print(f"[sdr_memory] Error fetching conversation memory: {e}")
        return []


def log_conversation(
    lead_id: int,
    sender: str,
    message: str,
    msg_type: str,
    followup_id: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Save one conversation message.
    """

    try:

        payload: Dict[str, Any] = {
            "lead_id": lead_id,
            "sender": sender,
            "message": message,
            "type": msg_type,
        }

        if followup_id is not None:
            payload["followup_id"] = followup_id

        response = safe_insert(
            "conversation_memory",
            payload,
        )

        if response.data:
            return cast(Dict[str, Any], response.data[0])

        return {}

    except Exception as e:
        print(f"[sdr_memory] Error logging conversation: {e}")
        return {}


def log_workflow_run(
    lead_id: int,
    action_type: str,
    input_data: Any,
    output_data: Any,
    status: str = "success",
) -> Dict[str, Any]:
    """
    Save workflow execution.
    """

    try:

        payload = {
            "lead_id": lead_id,
            "action_type": action_type,
            "input_data": input_data,
            "output_data": output_data,
            "status": status,
        }

        response = safe_insert(
            "workflow_runs",
            payload,
        )

        if response.data:
            return cast(Dict[str, Any], response.data[0])

        return {}

    except Exception as e:
        print(f"[sdr_memory] Error logging workflow run: {e}")
        return {}


def learn_successful_pattern(
    lead_id: int,
    category: str,
    context: str,
    strategy_details: Dict[str, Any],
    score: float,
) -> Dict[str, Any]:
    """
    Save successful SDR strategy into CRM memory.
    """

    try:

        payload = {
            "lead_id": lead_id,
            "category": category,
            "context": context,
            "strategy_details": strategy_details,
            "success_score": score,
        }

        response = safe_insert(
            "crm_memory",
            payload,
        )

        if response.data:
            return cast(Dict[str, Any], response.data[0])

        return {}

    except Exception as e:
        print(f"[sdr_memory] Error saving crm_memory: {e}")
        return {}
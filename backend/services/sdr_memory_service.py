from typing import Any, Dict, Optional, cast

from services.supabase_client import supabase, safe_insert


# Conversation memory functions moved to memory_service.py
# This file now only contains workflow and CRM learning functions


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
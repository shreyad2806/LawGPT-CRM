from typing import Any, Dict, List, Optional, cast

from services.supabase_client import supabase, safe_insert, safe_update


# Actual columns from Supabase lead_followups table
FOLLOWUP_COLUMNS = {
    "id",
    "lead_id",
    "followup_message",
    "followup_type",
    "status",
    "scheduled_date",
    "sent_date",
    "created_at",
    "updated_at"
}


def _filter_followup_payload(
    data: Dict[str, Any]
) -> Dict[str, Any]:

    payload = {
        k: v
        for k, v in data.items()
        if k in FOLLOWUP_COLUMNS and v is not None
    }

    return payload


def save_followup(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Save a new followup to the lead_followups table."""
    try:
        payload = _filter_followup_payload(data)

        if not payload:
            raise ValueError("No valid fields to insert")

        print("\nPAYLOAD TO SUPABASE:")
        print(payload)

        response = safe_insert("lead_followups", payload)

        return cast(List[Dict[str, Any]], response.data or [])
    except Exception as e:
        print(f"Error saving followup: {e}")
        raise


def get_followups(
    status: Optional[str] = None,
    followup_type: Optional[str] = None,
    lead_id: Optional[int] = None,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """Get followups from the lead_followups table with optional filtering."""
    try:
        query = supabase.table("lead_followups").select("*")

        if status:
            query = query.eq("status", status)

        if followup_type:
            query = query.eq("followup_type", followup_type)

        if lead_id:
            query = query.eq("lead_id", lead_id)

        response = query.order("created_at", desc=True).limit(limit).execute()

        return cast(List[Dict[str, Any]], response.data or [])
    except Exception as e:
        print(f"Error fetching followups: {e}")
        raise


def update_followup(followup_id: int, updates: Dict[str, Any]) -> Optional[List[Dict[str, Any]]]:
    """Update an existing followup in the lead_followups table."""
    try:
        payload = _filter_followup_payload(updates)

        if not payload:
            return None

        print(f"\nUPDATING FOLLOWUP {followup_id}:")
        print(payload)

        response = (
            supabase
            .table("lead_followups")
            .update(payload)
            .eq("id", followup_id)
            .execute()
        )

        return cast(List[Dict[str, Any]], response.data or [])
    except Exception as e:
        print(f"Error updating followup: {e}")
        raise


def delete_followup(followup_id: int) -> bool:
    """Delete a followup from the lead_followups table."""
    try:
        response = (
            supabase
            .table("lead_followups")
            .delete()
            .eq("id", followup_id)
            .execute()
        )

        return True
    except Exception as e:
        print(f"Error deleting followup: {e}")
        raise
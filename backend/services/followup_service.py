from typing import Any, Dict, List, Optional, cast
from datetime import datetime

from services.supabase_client import supabase, safe_insert, safe_update


FOLLOWUP_COLUMNS = {

    "id",

    "lead_id",

    "followup_message",

    "followup_type",

    "status",

    "created_at",

    "lead_name",

    "company",

    "intent",

    "score",

    "priority",

    "next_action",

    "generated_reply",

    "due_date",

    "completed_at"

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
    """Get followups from the lead_followups table with optional filtering, including joined lead data."""
    try:
        print(f"[followup_service] get_followups called with status={status}, followup_type={followup_type}, lead_id={lead_id}, limit={limit}")
        query = supabase.table("lead_followups").select("*, leads(*)")

        if status:
            query = query.eq("status", status)
            print(f"[followup_service] Filtering by status: {status}")

        if followup_type:
            query = query.eq("followup_type", followup_type)
            print(f"[followup_service] Filtering by followup_type: {followup_type}")

        if lead_id:
            query = query.eq("lead_id", lead_id)
            print(f"[followup_service] Filtering by lead_id: {lead_id}")

        response = query.order("created_at", desc=True).limit(limit).execute()
        
        print(f"[followup_service] Supabase response: {response}")
        print(f"[followup_service] Response data length: {len(response.data) if response.data else 0}")
        print(f"[followup_service] Response data: {response.data}")

        return cast(List[Dict[str, Any]], response.data or [])
    except Exception as e:
        print(f"[followup_service] Error fetching followups: {e}")
        import traceback
        traceback.print_exc()
        raise


def get_followup(followup_id: int) -> Optional[Dict[str, Any]]:
    """Get a single followup with its joined lead data."""
    try:
        response = supabase.table("lead_followups").select("*, leads(*)").eq("id", followup_id).execute()
    
        if response.data:

          data = cast(List[Dict[str, Any]], response.data)

          return data[0]

          return None
    except Exception as e:
        print(f"Error fetching followup {followup_id}: {e}")
        raise


def update_followup(followup_id: int, updates: Dict[str, Any]) -> Optional[List[Dict[str, Any]]]:

    print("========== UPDATE FOLLOWUP ==========")
    print("followup_id:", followup_id)
    print("updates:", updates)

    try:
        payload = _filter_followup_payload(updates)

        if not payload:
            print("No payload after filtering")
            return None

        print("\nUPDATING FOLLOWUP:", followup_id)
        print("Payload:", payload)

        response = (
            supabase
            .table("lead_followups")
            .update(payload)
            .eq("id", followup_id)
            .execute()
        )

        print("========== UPDATE RESPONSE ==========")
        print(response.data)
        print("=====================================")

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


def check_followup_exists(lead_id: int) -> bool:
    """Check if a followup already exists for the given lead_id."""
    try:
        print(f"[followup_service] Checking if followup exists for lead_id={lead_id}")
        response = (
            supabase
            .table("lead_followups")
            .select("id")
            .eq("lead_id", lead_id)
            .limit(1)
            .execute()
        )
        
        rows = cast(
        List[Dict[str, Any]],
         response.data or [],
        )

        exists = len(rows) > 0
        print(f"[followup_service] Followup exists for lead_id={lead_id}: {exists}")
        return exists
    except Exception as e:
        print(f"[followup_service] Error checking if followup exists: {e}")
        return False


def create_followup_from_lead(
    lead: Dict[str, Any],
    engagement: Optional[Dict[str, Any]] = None,
    analysis: Optional[Dict[str, Any]] = None,
) -> Optional[Dict[str, Any]]:

    try:

        print("\n========== CREATE FOLLOWUP ==========")
        print("Lead:", lead)
        print("Engagement:", engagement)
        print("Analysis:", analysis)

        engagement = engagement or {}
        analysis = analysis or {}

        lead_id = lead.get("id")

        if not lead_id:
            print("Lead id missing")
            return None

        if check_followup_exists(lead_id):
            print("Duplicate followup exists")
            return None

        score = (
            lead.get("lead_score")
            or analysis.get("lead_score")
            or 0
        )

        if score >= 90:
            priority = "Critical"
        elif score >= 75:
            priority = "High"
        elif score >= 50:
            priority = "Medium"
        else:
            priority = "Low"

        from datetime import datetime, timedelta

        payload = {

            "lead_id": lead_id,

            "followup_message":
                engagement.get("message", ""),

            "followup_type":
                "Initial Outreach",

            "status":
                "Pending",

            "lead_name":
                lead.get("name"),

            "company":
                lead.get("company"),

            "intent":
                analysis.get("intent"),

            "score":
                analysis.get("lead_score", 0),

            "priority":
                priority,

            "next_action":
                "Reply within 24 hours",

            "generated_reply":
                f"Hi {lead.get('name')}, thanks for reaching out to LawGPT. We'd love to schedule a demo.",

            "due_date":
                (datetime.utcnow() + timedelta(days=1)).isoformat()

        }

        print("\n========== ORIGINAL PAYLOAD ==========")
        print(payload)

        filtered_payload = _filter_followup_payload(payload)

        print("\n========== FILTERED PAYLOAD ==========")
        print(filtered_payload)

        if not filtered_payload:
            print("Payload empty after filtering")
            return None

        print("\n========== FOLLOWUP INSERT ==========")
        print(filtered_payload)

        res = (
            supabase
            .table("lead_followups")
            .insert(filtered_payload)
            .execute()
        )

        print("\n========== SUPABASE RESPONSE ==========")
        print(res.data)

        rows = cast(
            List[Dict[str, Any]],
            res.data or []
        )

        if not rows:
            print("No rows returned from Supabase")
            return None

        created_followup = rows[0]

        print("\n========== CREATED FOLLOWUP ==========")
        print(created_followup)

        return created_followup

    except Exception as e:

        print("\n========== FOLLOWUP INSERT ERROR ==========")
        print(e)

        import traceback
        traceback.print_exc()

        return None
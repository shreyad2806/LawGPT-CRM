from typing import Any, Dict, List, cast, Optional

from services.supabase_client import supabase, safe_insert, safe_update
from services.lead_activity_service import log_lead_created
from services.followup_service import create_followup_from_lead


# Actual columns from Supabase leads table
LEAD_COLUMNS = {
    "id",
    "name",
    "company",
    "role",
    "platform",
    "profile_url",
    "engagement_type",
    "discovery_source",
    "discovery_from_post",
    "lead_score",
    "lead_category",
    "lead_quality",
    "score_reason",
    "recommended_action",
    "priority",
    "qualification_reason",
    "confidence",
    "tags",
    "reason",
    "status",
    "qualification_score",
    "qualification_status",
    "qualification_reason"
}


def _filter_lead_payload(
    data: Dict[str, Any]
) -> Dict[str, Any]:

    payload = {
        k: v
        for k, v in data.items()
        if k in LEAD_COLUMNS and v is not None
    }

    return payload


def save_lead(
    lead_data: Dict[str, Any]
):

    payload = _filter_lead_payload(
        lead_data
    )

    print("\nPAYLOAD TO SUPABASE:")
    print(payload)

    result = safe_insert("leads", payload)
    
    # Log lead created activity
    if result and result.data:
        lead = result.data[0]
        log_lead_created(lead["id"], lead)
        
        # Auto-create followup for the new lead
        print("[lead_service] Auto-creating followup for new lead")
        try:
            followup = create_followup_from_lead(lead=lead)
            if followup:
                print(f"[lead_service] Followup created successfully: id={followup.get('id')}")
            else:
                print("[lead_service] Followup not created (duplicate or error)")
        except Exception as e:
            print(f"[lead_service] Error creating followup: {e}")
            import traceback
            traceback.print_exc()
    
    return result


def get_all_leads() -> List[Dict[str, Any]]:
    try:
        print("GET /api/leads called - fetching leads from Supabase")
        response = (
            supabase
            .table("leads")
            .select("*")
            .execute()
        )

        leads = cast(
            List[Dict[str, Any]],
            response.data or []
        )
        print(f"Lead count: {len(leads)}")
        return leads
    except Exception as e:
        print(f"Error fetching leads: {e}")
        raise


def get_new_leads() -> List[Dict[str, Any]]:

    response = (
        supabase
        .table("leads")
        .select("*")
        .eq("status", "new")
        .execute()
    )

    return cast(
        List[Dict[str, Any]],
        response.data or []
    )


def update_lead(
    lead_id: int,
    update_data: Dict[str, Any]
):

    payload = _filter_lead_payload(
        update_data
    )

    if not payload:
        return None

    print(
        f"\nUPDATING LEAD {lead_id}:"
    )
    print(payload)

    return (
        supabase
        .table("leads")
        .update(payload)
        .eq("id", lead_id)
        .execute()
    )


def get_lead_by_id(lead_id: int) -> Optional[Dict[str, Any]]:
    """Get a single lead by ID."""
    try:
        print(f"GET /api/leads/{lead_id} called - fetching lead from Supabase")
        response = (
            supabase
            .table("leads")
            .select("*")
            .eq("id", lead_id)
            .execute()
        )

        leads = cast(
            List[Dict[str, Any]],
            response.data or []
        )
        
        if not leads:
            print(f"Lead with id {lead_id} not found")
            return None
        
        lead = leads[0]
        print(f"Lead found: {lead.get('name', 'Unknown')}")
        return lead
    except Exception as e:
        print(f"Error fetching lead by id: {e}")
        raise


def delete_lead(
    lead_id: int
):

    return (
        supabase
        .table("leads")
        .delete()
        .eq("id", lead_id)
        .execute()
    )
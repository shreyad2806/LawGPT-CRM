from typing import Any, Dict, List, cast

from services.supabase_client import supabase


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

    return (
        supabase
        .table("leads")
        .insert(payload)
        .execute()
    )


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
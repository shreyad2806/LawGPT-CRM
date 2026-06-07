from typing import Any, Dict, List, Optional, cast
import json

from services.supabase_client import supabase


def log_activity(
    lead_id: int,
    activity_type: str,
    description: str,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:

    try:

        payload = {
            "lead_id": lead_id,
            "activity_type": activity_type,
            "description": description,
            "metadata": json.dumps(metadata) if metadata else None,
        }

        response = (
            supabase.table("lead_activity")
            .insert(payload)
            .execute()
        )

        if response.data:
            return cast(Dict[str, Any], response.data[0])

        return {}

    except Exception as e:

        print(f"[lead_activity] {e}")

        return {}


def get_lead_activities(
    lead_id: int,
) -> List[Dict[str, Any]]:

    try:

        response = (
            supabase.table("lead_activity")
            .select("*")
            .eq("lead_id", lead_id)
            .order("created_at", desc=True)
            .execute()
        )

        return cast(
            List[Dict[str, Any]],
            response.data or [],
        )

    except Exception as e:

        print(e)

        return []


def log_engagement_created(
    lead_id: int,
    engagement: Dict[str, Any],
):

    return log_activity(
        lead_id,
        "engagement_created",
        f"Engagement created from {engagement.get('source','Unknown')}",
        engagement,
    )


def log_lead_created(
    lead_id: int,
    lead: Dict[str, Any],
):

    return log_activity(
        lead_id,
        "lead_created",
        "Lead created",
        lead,
    )


def log_ai_qualified(
    lead_id: int,
    analysis: Dict[str, Any],
):

    return log_activity(
        lead_id,
        "ai_qualified",
        f"AI Score {analysis.get('lead_score')}",
        analysis,
    )


def log_followup_created(
    lead_id: int,
    followup: Dict[str, Any],
):

    return log_activity(
        lead_id,
        "followup_created",
        "Initial followup generated",
        followup,
    )


def log_followup_completed(
    lead_id: int,
    followup: Dict[str, Any],
):

    return log_activity(
        lead_id,
        "followup_completed",
        "Followup completed",
        followup,
    )


def log_status_updated(
    lead_id: int,
    old_status: str,
    new_status: str,
):

    return log_activity(
        lead_id,
        "status_updated",
        f"{old_status}->{new_status}",
        {
            "old": old_status,
            "new": new_status,
        },
    )


def log_followup_status_updated(
    lead_id: int,
    followup_id: int,
    old_status: str,
    new_status: str,
):

    return log_activity(
        lead_id,
        "followup_status_updated",
        f"{old_status}->{new_status}",
        {
            "followup_id": followup_id,
            "old": old_status,
            "new": new_status,
        },
    )


def log_reply_generated(
    lead_id: int,
    followup_id: int,
    message: str,
):

    return log_activity(
        lead_id,
        "reply_generated",
        "AI reply generated",
        {
            "followup_id": followup_id,
            "message": message,
        },
    )


def log_recommendation_generated(
    lead_id: int,
    followup_id: int,
    recommendation: Dict[str, Any],
):

    return log_activity(
        lead_id,
        "recommendation_generated",
        "AI recommendation",
        {
            "followup_id": followup_id,
            **recommendation,
        },
    )


def log_lead_merged(
    lead_id: int,
    from_source: str,
    metadata: Optional[Dict[str, Any]] = None,
):

    return log_activity(
        lead_id,
        "lead_merged",
        f"Merged from {from_source}",
        metadata or {},
    )


def log_lead_updated(
    lead_id: int,
    update_fields: Dict[str, Any],
):

    return log_activity(
        lead_id,
        "lead_updated",
        "Lead updated",
        update_fields,
    )
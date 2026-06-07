from typing import Any, Dict, List, Optional, cast
from datetime import datetime, timezone

from services.supabase_client import supabase, safe_insert


def get_notifications(
    lead_id: Optional[int] = None,
    limit: int = 50,
) -> List[Dict[str, Any]]:
    """
    Get recent notifications.
    """

    try:
        query = (
            supabase.table("notifications")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
        )

        if lead_id is not None:
            query = query.eq("lead_id", lead_id)

        response = query.execute()

        return cast(List[Dict[str, Any]], response.data or [])

    except Exception as e:
        print(f"[notification_service] Error fetching notifications: {e}")
        return []


def create_notification(
    title: str,
    message: str,
    notification_type: str,
    lead_id: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Create a notification.
    """

    try:

        payload: Dict[str, Any] = {
            "title": title,
            "message": message,
            "type": notification_type,
        }

        if lead_id is not None:
            payload["lead_id"] = lead_id

        response = safe_insert(
            "notifications",
            payload,
        )

        if response.data:
            return cast(Dict[str, Any], response.data[0])

        return {}

    except Exception as e:
        print(f"[notification_service] Error creating notification: {e}")
        return {}


def check_overdue_followups() -> None:
    """
    Check overdue followups and generate notifications.
    """

    try:

        now = datetime.now(timezone.utc).isoformat()

        response = (
            supabase.table("lead_followups")
            .select("*")
            .lt("scheduled_date", now)
            .neq("status", "Completed")
            .execute()
        )

        followups = cast(List[Dict[str, Any]], response.data or [])

        print(
            f"[notification_service] Found {len(followups)} overdue followups"
        )

        for followup in followups:

            lead_id = followup.get("lead_id")

            lead_name = "Unknown"

            if lead_id is not None:

                try:

                    lead_response = (
                        supabase.table("leads")
                        .select("name")
                        .eq("id", lead_id)
                        .limit(1)
                        .execute()
                    )

                    lead_data = cast(
                        List[Dict[str, Any]],
                        lead_response.data or [],
                    )

                    if lead_data:
                        lead_name = lead_data[0].get("name", "Unknown")

                except Exception as err:
                    print(
                        f"[notification_service] Lead lookup failed: {err}"
                    )

            create_notification(
                title="Followup Overdue",
                message=f"Followup for {lead_name} is overdue.",
                notification_type="overdue",
                lead_id=lead_id,
            )

    except Exception as e:
        print(
            f"[notification_service] Error checking overdue followups: {e}"
        )

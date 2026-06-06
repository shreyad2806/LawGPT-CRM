from typing import Any, Dict, List, Optional
from services.supabase_client import supabase
import json


# Actual columns from Supabase lead_activity table
LEAD_ACTIVITY_COLUMNS = {
    "id",
    "lead_id",
    "activity_type",
    "description",
    "metadata",
    "created_at"
}


def log_activity(
    lead_id: int,
    activity_type: str,
    description: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Log an activity for a lead.
    
    Args:
        lead_id: The ID of the lead
        activity_type: Type of activity (e.g., "engagement_created", "lead_created", "ai_qualified", "followup_created", "followup_completed", "status_updated")
        description: Human-readable description of the activity
        metadata: Optional additional data about the activity
    
    Returns:
        The created activity record
    """
    try:
        print(f"[lead_activity_service] Logging activity: {activity_type} for lead {lead_id}")
        
        activity_data = {
            "lead_id": lead_id,
            "activity_type": activity_type,
            "description": description,
            "metadata": json.dumps(metadata) if metadata else None
        }
        
        print(f"[lead_activity_service] Activity data: {activity_data}")
        
        response = supabase.table("lead_activity").insert(activity_data).execute()
        print(f"[lead_activity_service] Activity logged successfully: {response.data}")
        
        return response.data[0] if response.data else {}
    except Exception as e:
        print(f"[lead_activity_service] Error logging activity: {e}")
        # Don't raise - activity logging should not break the main flow
        return {}


def get_lead_activities(lead_id: int) -> List[Dict[str, Any]]:
    """
    Get all activities for a lead, ordered by created_at descending (newest first).
    
    Args:
        lead_id: The ID of the lead
    
    Returns:
        List of activity records
    """
    try:
        print(f"[lead_activity_service] Fetching activities for lead {lead_id}")
        
        response = (
            supabase
            .table("lead_activity")
            .select("*")
            .eq("lead_id", lead_id)
            .order("created_at", desc=True)
            .execute()
        )
        
        activities = response.data or []
        print(f"[lead_activity_service] Found {len(activities)} activities")
        
        return activities
    except Exception as e:
        print(f"[lead_activity_service] Error fetching activities: {e}")
        return []


def log_engagement_created(lead_id: int, engagement_data: Dict[str, Any]) -> Dict[str, Any]:
    """Log when an engagement is created for a lead."""
    return log_activity(
        lead_id=lead_id,
        activity_type="engagement_created",
        description=f"Engagement created from {engagement_data.get('source', 'Unknown')}",
        metadata={
            "source": engagement_data.get("source"),
            "platform": engagement_data.get("platform"),
            "message": engagement_data.get("message")[:200] if engagement_data.get("message") else None
        }
    )


def log_lead_created(lead_id: int, lead_data: Dict[str, Any]) -> Dict[str, Any]:
    """Log when a lead is created."""
    return log_activity(
        lead_id=lead_id,
        activity_type="lead_created",
        description=f"Lead created from {lead_data.get('discovery_source', 'Manual Entry')}",
        metadata={
            "discovery_source": lead_data.get("discovery_source"),
            "platform": lead_data.get("platform"),
            "company": lead_data.get("company")
        }
    )


def log_ai_qualified(lead_id: int, analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Log when a lead is AI qualified."""
    return log_activity(
        lead_id=lead_id,
        activity_type="ai_qualified",
        description=f"AI Qualified - {analysis.get('lead_quality', 'Unknown')} quality, score: {analysis.get('lead_score', 0)}",
        metadata={
            "lead_score": analysis.get("lead_score"),
            "lead_quality": analysis.get("lead_quality"),
            "intent": analysis.get("intent"),
            "recommended_action": analysis.get("recommended_action")
        }
    )


def log_followup_created(lead_id: int, followup_data: Dict[str, Any]) -> Dict[str, Any]:
    """Log when a followup is created for a lead."""
    return log_activity(
        lead_id=lead_id,
        activity_type="followup_created",
        description=f"Followup scheduled: {followup_data.get('action', 'Unknown')}",
        metadata={
            "action": followup_data.get("action"),
            "scheduled_date": followup_data.get("scheduled_date"),
            "notes": followup_data.get("notes")
        }
    )


def log_followup_completed(lead_id: int, followup_data: Dict[str, Any]) -> Dict[str, Any]:
    """Log when a followup is completed for a lead."""
    return log_activity(
        lead_id=lead_id,
        activity_type="followup_completed",
        description=f"Followup completed: {followup_data.get('action', 'Unknown')}",
        metadata={
            "action": followup_data.get("action"),
            "completed_date": followup_data.get("completed_date"),
            "notes": followup_data.get("notes")
        }
    )


def log_status_updated(lead_id: int, old_status: str, new_status: str) -> Dict[str, Any]:
    """Log when a lead status is updated."""
    return log_activity(
        lead_id=lead_id,
        activity_type="status_updated",
        description=f"Status changed from {old_status} to {new_status}",
        metadata={
            "old_status": old_status,
            "new_status": new_status
        }
    )


def log_lead_merged(lead_id: int, from_source: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Log when a lead is merged with another lead."""
    return log_activity(
        lead_id=lead_id,
        activity_type="lead_merged",
        description=f"Lead merged from {from_source}",
        metadata=metadata or {}
    )


def log_lead_updated(lead_id: int, update_fields: Dict[str, Any]) -> Dict[str, Any]:
    """Log when a lead is updated."""
    return log_activity(
        lead_id=lead_id,
        activity_type="lead_updated",
        description=f"Lead updated with {len(update_fields)} fields",
        metadata=update_fields
    )

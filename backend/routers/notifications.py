from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from typing import Optional
from services.notification_service import get_notifications, check_overdue_followups

router = APIRouter()

@router.get("/")
async def list_notifications(
    lead_id: Optional[int] = None,
    limit: int = 50,
):
    """Get all notifications, optionally filtered by lead."""
    try:
        # Before returning, we can trigger an overdue check (in a real app this would be a cron job)
        check_overdue_followups()
        
        notifications = get_notifications(lead_id=lead_id, limit=limit)
        return {"notifications": notifications}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notifications: {str(e)}")

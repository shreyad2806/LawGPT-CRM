from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from services.engagement_logs_service import (
    get_engagement_logs, 
    create_engagement_log, 
    update_engagement_log, 
    delete_engagement_log,
    analyze_engagement,
    save_engagement_with_analysis
)

router = APIRouter()


@router.get("/")
async def get_all_engagement_logs() -> Dict[str, Any]:
    """Get all engagement logs."""
    try:
        print("[routers.engagement_logs] get_all_engagement_logs called")
        engagement_logs = get_engagement_logs()
        print(f"[routers.engagement_logs] returned {len(engagement_logs)} logs")
        return {"engagement_logs": engagement_logs}
    except Exception as e:
        print(f"[routers.engagement_logs] error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_engagement_log_route(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new engagement log with analysis and lead creation."""
    try:
        print("[routers.engagement_logs] create_engagement_log_route called with:", data)
        
        # Handle screenshot_data if provided (convert base64 to bytes)
        screenshot_data = data.get("screenshot_data")
        if screenshot_data:
            import base64
            try:
                data["screenshot_data"] = base64.b64decode(screenshot_data)
                print("[routers.engagement_logs] Screenshot data decoded to bytes")
            except Exception as e:
                print(f"[routers.engagement_logs] Error decoding screenshot data: {e}")
                data["screenshot_data"] = None
        
        result = save_engagement_with_analysis(data)
        return result
    except Exception as e:
        print(f"[routers.engagement_logs] error creating engagement log: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{engagement_id}")
async def update_engagement_log_route(engagement_id: int, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update an engagement log."""
    try:
        print(f"[routers.engagement_logs] update_engagement_log_route called id={engagement_id} updates={updates}")
        result = update_engagement_log(engagement_id, updates)
        return result
    except Exception as e:
        print(f"[routers.engagement_logs] error updating engagement log: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{engagement_id}")
async def delete_engagement_log_route(engagement_id: int) -> Dict[str, Any]:
    """Delete an engagement log."""
    try:
        print(f"[routers.engagement_logs] delete_engagement_log_route called id={engagement_id}")
        result = delete_engagement_log(engagement_id)
        return {"success": True}
    except Exception as e:
        print(f"[routers.engagement_logs] error deleting engagement log: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze")
async def analyze_engagement_route(data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze an engagement message."""
    try:
        print("[routers.engagement_logs] analyze_engagement_route called with:", data)
        message = data.get("message", "")
        source = data.get("source", "")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        analysis = analyze_engagement(message, source)
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        print(f"[routers.engagement_logs] error analyzing engagement: {e}")
        raise HTTPException(status_code=500, detail=str(e))

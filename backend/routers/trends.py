from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import traceback

from services.trend_service import get_recent_trends

router = APIRouter()


@router.get("/recent")
async def recent_trends() -> List[Dict[str, Any]]:
    """Get recent trends (ordered by trend_score desc).

    This endpoint logs the returned rows and any traceback, and always
    returns a JSON array (possibly empty) for easier frontend handling.
    """
    try:
        rows = get_recent_trends(limit=6) or []

        print(f"[router.trends] Rows returned from service: {rows}")

        trends: List[Dict[str, Any]] = []
        for r in rows:
            item: Dict[str, Any] = {
                "id": r.get("id"),
                "title": r.get("title", ""),
                "summary": r.get("summary", ""),
                "category": r.get("category", ""),
                "trend_score": int(r.get("trend_score") or 0),
                "urgency": (r.get("urgency") or "").lower(),
                "url": r.get("url", ""),
                "created_at": str(r.get("created_at") or "")
            }

            # Include published_at only if present in the row (avoid referencing missing columns)
            if "published_at" in r:
                item["published_at"] = str(r.get("published_at") or "")

            trends.append(item)

        # Always return a list (empty if no rows)
        return trends

    except Exception:
        tb = traceback.format_exc()
        print("[router.trends] Exception in /api/trends/recent:\n" + tb)
        # Surface the traceback in the error detail to help debugging (developer-only)
        raise HTTPException(status_code=500, detail={"error": "Failed to fetch recent trends", "traceback": tb})

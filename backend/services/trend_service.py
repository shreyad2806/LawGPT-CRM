from typing import Any, Dict, List, Tuple, cast
import traceback

from services.supabase_client import supabase


def _column_exists(col: str) -> Tuple[bool, str]:
    """Check whether a column exists on the `trends` table by attempting a select.
    Returns (exists, error_message).
    """
    try:
        resp = supabase.table("trends").select(col).limit(1).execute()
        err = getattr(resp, "error", None)
        if err:
            return False, str(err)
        return True, ""
    except Exception as e:
        return False, str(e)


def get_recent_trends(limit: int = 6) -> List[Dict[str, Any]]:
    """Retrieve recent trends from Supabase ordered by trend_score desc.

    This function performs defensive checks to verify the requested columns
    exist and logs the SQL-like query, returned rows and any traceback for debugging.
    """
    expected_cols = [
        "id",
        "title",
        "summary",
        "url",
        "category",
        "trend_score",
        "urgency",
        "created_at",
    ]

    optional_cols = ["published_at", "source"]

    try:
        # Verify which columns actually exist
        available_cols = []
        missing_cols = []
        for c in expected_cols + optional_cols:
            ok, err = _column_exists(c)
            if ok:
                available_cols.append(c)
            else:
                missing_cols.append((c, err))

        if missing_cols:
            print("[trend_service] Missing columns detected:")
            for c, err in missing_cols:
                print(f"  - {c}: {err}")

        # Ensure we only select columns that exist (prefer expected cols ordering)
        select_cols = [c for c in expected_cols if c in available_cols]
        # Add optional cols only if present
        for c in optional_cols:
            if c in available_cols:
                select_cols.append(c)

        if not select_cols:
            print("[trend_service] No selectable columns found on trends table.")
            return []

        query_str = f"SELECT {', '.join(select_cols)} FROM trends ORDER BY trend_score DESC LIMIT {limit}"
        print(f"[trend_service] Supabase query: {query_str}")

        response = (
            supabase
            .table("trends")
            .select(",".join(select_cols))
            .order("trend_score", desc=True)
            .limit(limit)
            .execute()
        )

        # Log response details
        resp_err = getattr(response, "error", None)
        print(f"[trend_service] Supabase response error: {resp_err}")
        print(f"[trend_service] Returned rows: {response.data}")

        return cast(List[Dict[str, Any]], response.data or [])

    except Exception:
        tb = traceback.format_exc()
        print("[trend_service] Exception while fetching recent trends:")
        print(tb)
        raise


def save_trend(trend: Dict[str, Any]) -> Dict[str, Any]:
    """Insert or update a trend record.

    Duplicate definition: same title OR same url.
    If record exists, update it; otherwise insert new record.
    Returns the inserted/updated row data.
    """
    try:
        title = str(trend.get("title") or "").strip()
        url = str(trend.get("url") or "").strip()

        if not title and not url:
            raise ValueError("Trend must have at least a title or a url")

        # Try to find existing by url first (more reliable)
        existing = None
        if url:
            resp = supabase.table("trends").select("*").eq("url", url).limit(1).execute()
            row = (resp.data or [None])[0]
            if isinstance(row, dict):
                existing = row

        # If not found by url, try title
        if not existing and title:
            resp = supabase.table("trends").select("*").eq("title", title).limit(1).execute()
            row = (resp.data or [None])[0]
            if isinstance(row, dict):
                existing = row

        payload = {
            "title": title,
            "summary": trend.get("summary"),
            "category": trend.get("category"),
            "trend_score": int(trend.get("trend_score") or trend.get("score") or 0),
            "urgency": str(trend.get("urgency") or "").lower(),
            "content_opportunity": trend.get("content_opportunity"),
            "target_audience": trend.get("target_audience"),
            "url": url or None,
            "published_at": trend.get("published_at")
        }

        if existing and existing.get("id"):
            # Update existing record
            resp = supabase.table("trends").update(payload).eq("id", existing.get("id")).execute()
            row = (resp.data or [None])[0] if resp.data else None
            if isinstance(row, dict):
                return row
            return {}
        else:
            # Insert new record; include created_at
            from datetime import datetime
            payload["created_at"] = datetime.utcnow().isoformat()
            resp = supabase.table("trends").insert(payload).execute()
            row = (resp.data or [None])[0] if resp.data else None
            if isinstance(row, dict):
                return row
            return {}

    except Exception as e:
        print(f"Error saving trend: {e}")
        raise

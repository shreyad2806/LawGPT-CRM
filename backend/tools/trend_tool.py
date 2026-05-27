import requests
import os
from dotenv import load_dotenv
from typing import Any, Dict

load_dotenv()

N8N_BASE = os.getenv("N8N_BASE_URL")


def trigger_trend_workflow() -> Dict[str, Any]:
    """Trigger an external n8n webhook to run trend research."""

    if not N8N_BASE:
        return {"error": "N8N_BASE_URL not set"}

    url = f"{N8N_BASE.rstrip('/')}/webhook-test/trend-research"

    try:
        response = requests.post(url, timeout=90)
        response.raise_for_status()

        try:
            return response.json()
        except:
            return {
                "success": True,
                "message": "Workflow triggered"
            }

    except Exception as exc:
        return {"error": str(exc)}
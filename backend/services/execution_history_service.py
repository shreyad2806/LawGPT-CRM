from services.supabase_client import supabase
from datetime import datetime
from typing import Optional


def log_execution_event(
    agent_name: str,
    event: str,
    metadata: Optional[dict] = None
):

    return (
        supabase
        .table("agent_execution_history")
        .insert({
            "agent_name": agent_name,
            "event": event,
            "execution_time": datetime.utcnow().isoformat(),
            "metadata": metadata or {}
        })
        .execute()
    )
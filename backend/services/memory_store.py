from datetime import datetime

from services.supabase_client import supabase


def save_memory(
    agent_name: str,
    memory_type: str,
    memory_data: dict
):

    data = {

        "agent_name": agent_name,

        "memory_type": memory_type,

        "memory_data": memory_data,

        "created_at": (
            datetime.utcnow().isoformat()
        )

    }

    return (

        supabase
        .table("agent_memory")
        .insert(data)
        .execute()

    )
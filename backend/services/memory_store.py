from supabase import create_client
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()
# GET ENV VARIABLES
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")


# VALIDATE
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase environment variables missing")


# CREATE CLIENT
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)



def save_memory(
    agent_name: str,
    memory_type: str,
    memory_data: dict
):
    data = {
        "agent_name": agent_name,
        "memory_type": memory_type,
        "memory_data": memory_data,
        "created_at": datetime.utcnow().isoformat()
    }

    return (
        supabase
        .table("agent_memory")
        .insert(data)
        .execute()
    )
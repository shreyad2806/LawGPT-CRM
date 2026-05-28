from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path
import os


# LOAD ENV
env_path = Path(__file__).resolve().parent.parent / ".env"

load_dotenv(dotenv_path=env_path)


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


# FETCH MEMORY
def fetch_recent_memory(agent_name: str):

    response = (
        supabase
        .table("agent_memory")
        .select("agent_name, memory_type, memory_data, created_at")
        .eq("agent_name", agent_name)
        .order("created_at", desc=True)
        .limit(5)
        .execute()
    )

    return response.data
from services.supabase_client import supabase


def save_followup(data):

    return (
        supabase
        .table("lead_followups")
        .insert(data)
        .execute()
    )
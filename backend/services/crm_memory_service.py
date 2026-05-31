from services.supabase_client import supabase


def save_crm_memory(data):

    return (
        supabase
        .table("crm_memory")
        .insert(data)
        .execute()
    )
from services.memory_service import supabase


def save_strategy_memory(strategy_data):

    supabase.table("strategy_memory").insert({

        "strategy_name": "ai_legal_growth_strategy",

        "strategy_data": strategy_data,

        "performance_score": 0

    }).execute()
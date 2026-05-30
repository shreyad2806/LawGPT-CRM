from services.analytics_service import fetch_content_queue
from services.supabase_client import supabase

def save_crm_memory(data):
    return (
        supabase
        .table("crm_memory")
        .insert(data)
        .execute()
    )

def memory_agent(state):

    content = fetch_content_queue()

    topics = {}

    for row in content:

     print("\nROW:")
     print(row)

     if not isinstance(row, dict): continue

     payload = row.get("payload")

     print("PAYLOAD:", payload)
     print("TYPE:", type(payload))

     if payload is None:
        continue

     if not isinstance(payload, dict):
        continue

     hashtags = payload.get(
        "hashtags",
        []
    )

    for tag in hashtags:

        topics[tag] = (
            topics.get(tag, 0) + 1
        )
    

    best_topics = sorted(
        topics.items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]

    save_crm_memory({

        "memory_type":
            "top_topics",

        "memory_key":
            "hashtags",

        "memory_value":
            best_topics

    })

    state["memory_summary"] = {

        "top_topics":
            best_topics

    }

    state["completed_tasks"].append(
        "memory_complete"
    )

    return state
from services.supabase_client import supabase


def enqueue_generated_content(content_data):
    # DEBUG: show payload received for queue insertion
    print("QUEUE INSERT DEBUG:")
    print(content_data)

    try:
        generated_post = content_data["linkedin_post"]
    except KeyError as e:
        print("ERROR: content_data missing required key:", e)
        raise

    response = (
        supabase
        .table("content_queue")
        .insert({
            "generated_post": generated_post,
            "hook": content_data.get("hook"),
            "cta": content_data.get("cta"),
            "status": "draft",
            "payload": content_data
        })
        .execute()
    )

    # DEBUG: show insertion response
    try:
        print("QUEUE RESPONSE:", response.data)
    except Exception:
        print("QUEUE RESPONSE: no response data")

    return response.data
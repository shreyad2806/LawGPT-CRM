from services.supabase_client import supabase


def enqueue_generated_content(content_data):
    # Validate required schema key
    try:
        generated_post = content_data["linkedin_post"]
    except KeyError as e:
        # Raise a clear error but avoid printing raw payload to terminal
        raise KeyError("content_data missing required key: 'linkedin_post'") from e

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

    # Do not print raw DB responses; return response for callers to use if needed
    return response.data
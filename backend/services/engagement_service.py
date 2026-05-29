from services.supabase_client import (
    supabase
)


def save_engagement_metrics(
    analytics_data
):

    response = (

        supabase
        .table("engagement_logs")
        .insert({

            "likes": 120,

            "comments": 18,

            "shares": 7,

            "impressions": 2500

        })

        .execute()

    )

    return response.data
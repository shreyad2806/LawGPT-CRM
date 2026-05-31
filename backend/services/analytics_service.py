from typing import Any, Dict, List, cast

from services.supabase_client import supabase


def fetch_engagement_logs() -> List[Dict[str, Any]]:

    response = (
        supabase
        .table("engagement_logs")
        .select("*")
        .execute()
    )

    return cast(List[Dict[str, Any]], response.data or [])


def fetch_content_queue() -> List[Dict[str, Any]]:

    response = (
        supabase
        .table("content_queue")
        .select("*")
        .execute()
    )

    return cast(List[Dict[str, Any]], response.data or [])


def calculate_engagement_score(
    likes: int,
    comments: int,
    shares: int,
    impressions: int
) -> float:

    return round(
        (
            likes +
            comments * 3 +
            shares * 5
        )
        /
        max(impressions, 1)
        * 100,
        2
    )


def analyze_content_performance(
    content_data: Dict[str, Any]
) -> Dict[str, Any]:

    hashtags = content_data.get("hashtags", [])
    hook = content_data.get("hook", "")
    cta = content_data.get("cta", "")

    # =====================================
    # ENGAGEMENT ANALYSIS
    # =====================================

    logs: List[Dict[str, Any]] = fetch_engagement_logs()

    scores: List[float] = []

    for row in logs:
        if not isinstance(row, dict):
            continue

        likes = int(row.get("likes") or 0)
        comments = int(row.get("comments") or 0)
        shares = int(row.get("shares") or 0)
        impressions = int(row.get("impressions") or 0)

        score = calculate_engagement_score(likes, comments, shares, impressions)
        scores.append(score)

    engagement_score = (
        round(sum(scores) / len(scores), 2)
        if scores
        else 0
    )

    # =====================================
    # CONTENT ANALYSIS
    # =====================================

    content_rows: List[Dict[str, Any]] = fetch_content_queue()

    best_hooks: List[str] = []
    best_ctas: List[str] = []
    topics: Dict[str, int] = {}

    for row in content_rows:
        if not isinstance(row, dict):
            continue

        db_hook = row.get("hook")
        db_cta = row.get("cta")

        if isinstance(db_hook, str) and db_hook:
            best_hooks.append(db_hook)

        if isinstance(db_cta, str) and db_cta:
            best_ctas.append(db_cta)

        payload = row.get("payload")
        if not isinstance(payload, dict):
            payload = {}

        hashtags_in_payload = payload.get("hashtags", [])
        if isinstance(hashtags_in_payload, list):
            for tag in hashtags_in_payload:
                if not isinstance(tag, str):
                    continue
                topics[tag] = topics.get(tag, 0) + 1

    best_hooks = list(dict.fromkeys(best_hooks))[:5]
    best_ctas = list(dict.fromkeys(best_ctas))[:5]

    top_performing_topics = sorted(
    topics.keys(),
    key=lambda x: topics[x],
    reverse=True
    )[:5]

    # =====================================
    # RECOMMENDATION
    # =====================================

    if engagement_score >= 10:

        recommendation = (
            "Content is performing strongly. "
            "Scale similar campaigns."
        )

    elif engagement_score >= 5:

        recommendation = (
            "Performance is moderate. "
            "Improve hooks and CTAs."
        )

    else:

        recommendation = (
            "Low engagement. "
            "Experiment with new topics."
        )

    # =====================================
    # RETURN ANALYTICS
    # =====================================

    return {

        "top_performing_topics":
            top_performing_topics,

        "best_hooks":
            best_hooks or [hook],

        "best_ctas":
            best_ctas or [cta],

        "engagement_score":
            engagement_score,

        "recommendation":
            recommendation,

        "recommended_hashtags":
            hashtags

    }
from typing import Any, Dict, List, Optional, cast

from services.supabase_client import supabase


def fetch_engagement_logs() -> List[Dict[str, Any]]:
    """Fetch all engagement logs from the database."""
    try:
        response = (
            supabase
            .table("engagement_logs")
            .select("*")
            .execute()
        )

        return cast(List[Dict[str, Any]], response.data or [])
    except Exception as e:
        print(f"Error fetching engagement logs: {e}")
        raise


def fetch_content_queue() -> List[Dict[str, Any]]:
    """Fetch all content items from the content queue."""
    try:
        response = (
            supabase
            .table("content_queue")
            .select("*")
            .execute()
        )

        return cast(List[Dict[str, Any]], response.data or [])
    except Exception as e:
        print(f"Error fetching content queue: {e}")
        raise


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


def get_best_performers(limit: int = 10) -> List[Dict[str, Any]]:
    """Get best performing content items based on engagement metrics."""
    try:
        content_rows: List[Dict[str, Any]] = fetch_content_queue()
        engagement_logs: List[Dict[str, Any]] = fetch_engagement_logs()

        # Create a mapping of content_id to engagement metrics
        engagement_map: Dict[int, Dict[str, Any]] = {}
        for log in engagement_logs:
            if not isinstance(log, dict):
                continue
            content_id = log.get("content_id")
            if content_id:
                engagement_map[content_id] = {
                    "likes": int(log.get("likes") or 0),
                    "comments": int(log.get("comments") or 0),
                    "shares": int(log.get("shares") or 0),
                    "impressions": int(log.get("impressions") or 0)
                }

        # Calculate engagement scores for each content item
        performers: List[Dict[str, Any]] = []
        for row in content_rows:
            if not isinstance(row, dict):
                continue

            content_id = row.get("id")
            if not content_id:
                continue

            engagement = engagement_map.get(content_id, {
                "likes": 0,
                "comments": 0,
                "shares": 0,
                "impressions": 0
            })

            score = calculate_engagement_score(
                engagement["likes"],
                engagement["comments"],
                engagement["shares"],
                engagement["impressions"]
            )

            performers.append({
                "id": content_id,
                "hook": row.get("hook", ""),
                "cta": row.get("cta", ""),
                "platform": row.get("platform", "LinkedIn"),
                "engagement_score": score,
                "likes": engagement["likes"],
                "comments": engagement["comments"],
                "shares": engagement["shares"],
                "impressions": engagement["impressions"]
            })

        # Sort by engagement score and return top performers
        performers.sort(key=lambda x: x["engagement_score"], reverse=True)

        return performers[:limit]
    except Exception as e:
        print(f"Error fetching best performers: {e}")
        raise


def get_topic_scores(limit: int = 10) -> List[Dict[str, Any]]:
    """Get topic performance scores based on engagement metrics."""
    try:
        content_rows: List[Dict[str, Any]] = fetch_content_queue()
        engagement_logs: List[Dict[str, Any]] = fetch_engagement_logs()

        # Create a mapping of content_id to engagement metrics
        engagement_map: Dict[int, Dict[str, Any]] = {}
        for log in engagement_logs:
            if not isinstance(log, dict):
                continue
            content_id = log.get("content_id")
            if content_id:
                engagement_map[content_id] = {
                    "likes": int(log.get("likes") or 0),
                    "comments": int(log.get("comments") or 0),
                    "shares": int(log.get("shares") or 0),
                    "impressions": int(log.get("impressions") or 0)
                }

        # Aggregate scores by topic (hashtags in payload)
        topic_scores: Dict[str, List[float]] = {}
        for row in content_rows:
            if not isinstance(row, dict):
                continue

            content_id = row.get("id")
            if not content_id:
                continue

            engagement = engagement_map.get(content_id, {
                "likes": 0,
                "comments": 0,
                "shares": 0,
                "impressions": 0
            })

            score = calculate_engagement_score(
                engagement["likes"],
                engagement["comments"],
                engagement["shares"],
                engagement["impressions"]
            )

            # Extract topics from payload hashtags
            payload = row.get("payload", {})
            if not isinstance(payload, dict):
                payload = {}

            hashtags = payload.get("hashtags", [])
            if isinstance(hashtags, list):
                for tag in hashtags:
                    if isinstance(tag, str):
                        if tag not in topic_scores:
                            topic_scores[tag] = []
                        topic_scores[tag].append(score)

        # Calculate average score per topic
        topics: List[Dict[str, Any]] = []
        for topic, scores in topic_scores.items():
            if scores:
                avg_score = round(sum(scores) / len(scores), 2)
                topics.append({
                    "topic": topic,
                    "score": avg_score
                })

        # Sort by score and return top topics
        topics.sort(key=lambda x: x["score"], reverse=True)

        return topics[:limit]
    except Exception as e:
        print(f"Error fetching topic scores: {e}")
        raise


def get_analytics_recommendations() -> List[Dict[str, Any]]:
    """Generate recommendations based on actual analytics metrics."""
    try:
        analytics = analyze_content_performance({})
        engagement_score = analytics.get("engagement_score", 0)
        top_topics = analytics.get("top_performing_topics", [])
        best_hooks = analytics.get("best_hooks", [])
        best_ctas = analytics.get("best_ctas", [])

        recommendations: List[Dict[str, Any]] = []

        # Generate recommendations based on engagement score
        if engagement_score < 5:
            recommendations.append({
                "priority": "high",
                "text": "Low engagement detected. Experiment with new topics and content formats."
            })
        elif engagement_score < 10:
            recommendations.append({
                "priority": "medium",
                "text": "Moderate engagement. Improve hooks and CTAs based on top performers."
            })
        else:
            recommendations.append({
                "priority": "low",
                "text": "Content performing strongly. Scale similar campaigns."
            })

        # Topic-based recommendations
        if top_topics:
            top_topic = top_topics[0]
            recommendations.append({
                "priority": "high",
                "text": f"Increase content around {top_topic} - currently top performing topic."
            })

        # Hook pattern recommendations
        if best_hooks:
            recommendations.append({
                "priority": "medium",
                "text": "Use more hooks similar to top performing patterns."
            })

        # CTA recommendations
        if best_ctas:
            recommendations.append({
                "priority": "medium",
                "text": "Optimize CTAs based on best performing examples."
            })

        return recommendations
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        raise


def get_engagement_trends(limit: int = 30) -> List[Dict[str, Any]]:
    """Get engagement trends over time from engagement logs."""
    try:
        engagement_logs: List[Dict[str, Any]] = fetch_engagement_logs()

        # Group by date and calculate average engagement score
        date_scores: Dict[str, List[float]] = {}

        for log in engagement_logs:
            if not isinstance(log, dict):
                continue

            created_at = log.get("created_at")
            if not created_at:
                continue

            # Extract date (YYYY-MM-DD format)
            date_str = str(created_at)[:10]

            likes = int(log.get("likes") or 0)
            comments = int(log.get("comments") or 0)
            shares = int(log.get("shares") or 0)
            impressions = int(log.get("impressions") or 0)

            score = calculate_engagement_score(likes, comments, shares, impressions)

            if date_str not in date_scores:
                date_scores[date_str] = []
            date_scores[date_str].append(score)

        # Calculate average engagement per date
        trends: List[Dict[str, Any]] = []
        for date_str, scores in sorted(date_scores.items()):
            if scores:
                avg_score = round(sum(scores) / len(scores), 2)
                trends.append({
                    "date": date_str,
                    "engagement": avg_score
                })

        # Return most recent trends
        return trends[-limit:] if len(trends) > limit else trends
    except Exception as e:
        print(f"Error fetching engagement trends: {e}")
        raise


def get_crm_dashboard() -> Dict[str, Any]:
    """Get comprehensive CRM dashboard analytics from leads, followups, and engagement logs."""
    try:
        print("[analytics_service] get_crm_dashboard: Starting CRM dashboard analytics")

        # Fetch data from Supabase
        print("[analytics_service] get_crm_dashboard: Fetching leads from Supabase")
        leads_response = supabase.table("leads").select("*").execute()
        leads = cast(List[Dict[str, Any]], leads_response.data or [])
        print(f"[analytics_service] get_crm_dashboard: Fetched {len(leads)} leads")

        print("[analytics_service] get_crm_dashboard: Fetching lead_followups from Supabase")
        followups_response = supabase.table("lead_followups").select("*").execute()
        followups = cast(List[Dict[str, Any]], followups_response.data or [])
        print(f"[analytics_service] get_crm_dashboard: Fetched {len(followups)} followups")

        print("[analytics_service] get_crm_dashboard: Fetching engagement_logs from Supabase")
        engagement_logs_response = supabase.table("engagement_logs").select("*").execute()
        engagement_logs = cast(List[Dict[str, Any]], engagement_logs_response.data or [])
        print(f"[analytics_service] get_crm_dashboard: Fetched {len(engagement_logs)} engagement logs")

        # =====================================
        # METRICS
        # =====================================
        print("[analytics_service] get_crm_dashboard: Calculating metrics")

        total_leads = len(leads)

        # Qualified leads: lead_quality in ["Hot", "Warm"] or lead_score >= 60
        qualified_leads = 0
        for lead in leads:
            if not isinstance(lead, dict):
                continue
            lead_quality = lead.get("lead_quality", "")
            lead_score = int(lead.get("lead_score") or 0)
            if lead_quality in ["Hot", "Warm"] or lead_score >= 60:
                qualified_leads += 1

        # Followup counts
        pending_followups = 0
        completed_followups = 0
        for followup in followups:
            if not isinstance(followup, dict):
                continue
            status = followup.get("status", "")
            if status == "Pending":
                pending_followups += 1
            elif status == "Completed":
                completed_followups += 1

        # Average lead score
        lead_scores = []
        for lead in leads:
            if not isinstance(lead, dict):
                continue
            score = int(lead.get("lead_score") or 0)
            if score > 0:
                lead_scores.append(score)
        average_lead_score = round(sum(lead_scores) / len(lead_scores), 2) if lead_scores else 0

        # High priority leads: priority = "Hot" or lead_score >= 80
        high_priority_leads = 0
        for lead in leads:
            if not isinstance(lead, dict):
                continue
            priority = lead.get("priority", "")
            lead_score = int(lead.get("lead_score") or 0)
            if priority == "Hot" or lead_score >= 80:
                high_priority_leads += 1

        print(f"[analytics_service] get_crm_dashboard: Metrics - total_leads={total_leads}, qualified_leads={qualified_leads}, pending_followups={pending_followups}, completed_followups={completed_followups}, avg_score={average_lead_score}, high_priority={high_priority_leads}")

        # =====================================
        # LEAD SCORE DISTRIBUTION
        # =====================================
        print("[analytics_service] get_crm_dashboard: Calculating lead score distribution")

        score_buckets = {
            "0-20": 0,
            "21-40": 0,
            "41-60": 0,
            "61-80": 0,
            "81-100": 0
        }

        for lead in leads:
            if not isinstance(lead, dict):
                continue
            score = int(lead.get("lead_score") or 0)
            if score <= 20:
                score_buckets["0-20"] += 1
            elif score <= 40:
                score_buckets["21-40"] += 1
            elif score <= 60:
                score_buckets["41-60"] += 1
            elif score <= 80:
                score_buckets["61-80"] += 1
            else:
                score_buckets["81-100"] += 1

        lead_scores_distribution = [
            {"range": "0-20", "count": score_buckets["0-20"]},
            {"range": "21-40", "count": score_buckets["21-40"]},
            {"range": "41-60", "count": score_buckets["41-60"]},
            {"range": "61-80", "count": score_buckets["61-80"]},
            {"range": "81-100", "count": score_buckets["81-100"]}
        ]

        print(f"[analytics_service] get_crm_dashboard: Lead score distribution: {lead_scores_distribution}")

        # =====================================
        # INTENT DISTRIBUTION
        # =====================================
        print("[analytics_service] get_crm_dashboard: Calculating intent distribution")

        intent_counts: Dict[str, int] = {}
        for lead in leads:
            if not isinstance(lead, dict):
                continue
            intent = lead.get("intent") or "General Inquiry"
            intent_counts[intent] = intent_counts.get(intent, 0) + 1

        intent_distribution = [
            {"intent": intent, "count": count}
            for intent, count in sorted(intent_counts.items(), key=lambda x: x[1], reverse=True)
        ]

        print(f"[analytics_service] get_crm_dashboard: Intent distribution: {intent_distribution}")

        # =====================================
        # FOLLOWUP STATUS DISTRIBUTION
        # =====================================
        print("[analytics_service] get_crm_dashboard: Calculating followup status distribution")

        followup_status_counts: Dict[str, int] = {}
        for followup in followups:
            if not isinstance(followup, dict):
                continue
            status = followup.get("status") or "Unknown"
            followup_status_counts[status] = followup_status_counts.get(status, 0) + 1

        followup_distribution = [
            {"status": status, "count": count}
            for status, count in sorted(followup_status_counts.items(), key=lambda x: x[1], reverse=True)
        ]

        print(f"[analytics_service] get_crm_dashboard: Followup distribution: {followup_distribution}")

        # =====================================
        # WEEKLY LEAD TREND
        # =====================================
        print("[analytics_service] get_crm_dashboard: Calculating weekly lead trend")

        from datetime import datetime, timedelta

        # Group leads by week (last 8 weeks)
        weekly_counts: Dict[str, int] = {}
        today = datetime.utcnow()

        for lead in leads:
            if not isinstance(lead, dict):
                continue
            created_at = lead.get("created_at")
            if not created_at:
                continue

            try:
                lead_date = datetime.fromisoformat(str(created_at).replace('Z', '+00:00'))
                # Calculate week start (Monday)
                week_start = lead_date - timedelta(days=lead_date.weekday())
                week_key = week_start.strftime("%Y-%m-%d")
                weekly_counts[week_key] = weekly_counts.get(week_key, 0) + 1
            except Exception as e:
                print(f"[analytics_service] get_crm_dashboard: Error parsing date for lead: {e}")
                continue

        # Sort weeks and get last 8
        weekly_trend = [
            {"week": week, "count": count}
            for week, count in sorted(weekly_counts.items())[-8:]
        ]

        print(f"[analytics_service] get_crm_dashboard: Weekly trend: {weekly_trend}")

        # =====================================
        # TOP COMPANIES
        # =====================================
        print("[analytics_service] get_crm_dashboard: Calculating top companies")

        company_counts: Dict[str, int] = {}
        for lead in leads:
            if not isinstance(lead, dict):
                continue
            company = lead.get("company") or "Unknown"
            if company and company != "Unknown":
                company_counts[company] = company_counts.get(company, 0) + 1

        top_companies = [
            {"company": company, "count": count}
            for company, count in sorted(company_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        ]

        print(f"[analytics_service] get_crm_dashboard: Top companies: {top_companies}")

        # =====================================
        # AI INSIGHT
        # =====================================
        print("[analytics_service] get_crm_dashboard: Generating AI insight")

        insight = ""
        if engagement_logs:
            # Get recent AI summaries from engagement logs
            recent_summaries = []
            for log in engagement_logs[:5]:
                if not isinstance(log, dict):
                    continue
                ai_summary = log.get("ai_summary")
                if ai_summary:
                    recent_summaries.append(ai_summary)

            if recent_summaries:
                insight = f"Recent engagement insights: {recent_summaries[0]}"
            else:
                insight = "No AI insights available from recent engagements."
        else:
            insight = "No engagement data available for AI insights."

        print(f"[analytics_service] get_crm_dashboard: Insight: {insight}")

        # =====================================
        # RETURN DASHBOARD DATA
        # =====================================
        dashboard_data = {
            "metrics": {
                "total_leads": total_leads,
                "qualified_leads": qualified_leads,
                "pending_followups": pending_followups,
                "completed_followups": completed_followups,
                "average_lead_score": average_lead_score,
                "high_priority_leads": high_priority_leads
            },
            "lead_scores": lead_scores_distribution,
            "intent_distribution": intent_distribution,
            "followup_distribution": followup_distribution,
            "weekly_trend": weekly_trend,
            "top_companies": top_companies,
            "insight": insight
        }

        print("[analytics_service] get_crm_dashboard: Dashboard data compiled successfully")
        return dashboard_data

    except Exception as e:
        print(f"[analytics_service] get_crm_dashboard: Error generating CRM dashboard: {e}")
        import traceback
        traceback.print_exc()
        raise
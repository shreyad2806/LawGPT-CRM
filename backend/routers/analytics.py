from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from services.analytics_service import (
    fetch_engagement_logs,
    fetch_content_queue,
    analyze_content_performance,
    get_best_performers,
    calculate_engagement_score,
    get_topic_scores,
    get_analytics_recommendations,
    get_engagement_trends
)

router = APIRouter()

@router.get("/hashtags")
async def get_top_hashtags() -> Dict[str, Any]:
    """Get top performing hashtags"""
    try:
        # Use analyze_content_performance to get top performing topics
        analytics = analyze_content_performance({})
        top_topics = analytics.get("top_performing_topics", [])

        # Transform to match frontend schema
        hashtags = []
        for topic in top_topics:
            hashtags.append({
                "tag": topic if isinstance(topic, str) else str(topic),
                "count": 1  # Placeholder - would need actual count from data
            })

        return {"hashtags": hashtags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch hashtags: {str(e)}")

@router.get("/performers")
async def get_best_performers_route() -> Dict[str, Any]:
    """Get best performing content"""
    try:
        performers = get_best_performers(limit=10)

        # Transform to match frontend schema
        transformed_performers = []
        for item in performers:
            engagement_score = item.get("engagement_score", 0)
            transformed_performers.append({
                "hook": item.get("hook", ""),
                "engagement": f"{engagement_score:.1f}% CTR",
                "platform": item.get("platform", "LinkedIn")
            })

        return {"performers": transformed_performers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch performers: {str(e)}")

@router.get("/engagement")
async def get_engagement_metrics() -> Dict[str, Any]:
    """Get engagement metrics"""
    try:
        engagement_logs = fetch_engagement_logs()

        total_impressions = 0
        total_likes = 0
        total_comments = 0
        total_shares = 0

        for log in engagement_logs:
            if not isinstance(log, dict):
                continue
            total_impressions += int(log.get("impressions") or 0)
            total_likes += int(log.get("likes") or 0)
            total_comments += int(log.get("comments") or 0)
            total_shares += int(log.get("shares") or 0)

        # Calculate engagement rate
        engagement_rate = 0
        if total_impressions > 0:
            engagement_rate = round(
                ((total_likes + total_comments * 3 + total_shares * 5) / total_impressions) * 100,
                2
            )

        return {
            "total_impressions": total_impressions,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_shares": total_shares,
            "engagement_rate": engagement_rate
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch engagement metrics: {str(e)}")

@router.get("/trends")
async def get_content_trends() -> Dict[str, Any]:
    """Get content performance trends"""
    try:
        trends = get_engagement_trends(limit=30)
        return {"trends": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch trends: {str(e)}")

@router.get("/topics")
async def get_topics() -> List[Dict[str, Any]]:
    """Get topic performance scores"""
    try:
        topics = get_topic_scores(limit=10)
        return topics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch topics: {str(e)}")

@router.get("/recommendations")
async def get_recommendations() -> List[Dict[str, Any]]:
    """Get analytics recommendations"""
    try:
        recommendations = get_analytics_recommendations()
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recommendations: {str(e)}")

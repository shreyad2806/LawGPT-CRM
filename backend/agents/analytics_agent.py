from services.analytics_service import (
    analyze_content_performance
)

from services.strategy_memory import (
    save_strategy_memory
)

from services.logger_service import (
    log_agent_execution
)

from datetime import datetime



def analytics_agent(state):
    state.setdefault("execution_timeline", [])

    state["execution_timeline"].append({
        "agent": "analytics_agent",
        "event": "started",
        "timestamp": datetime.utcnow().isoformat()
    })

    content_data = state["tool_results"].get("content_data", {})

    analytics_result = (
        analyze_content_performance(
            content_data
        )
    )
    
    from services.engagement_service import (
    save_engagement_metrics
)
    save_engagement_metrics(
    analytics_result
)

    state["tool_results"][
        "analytics_data"
    ] = analytics_result

    save_strategy_memory({
        "analytics_result": analytics_result
    })

    log_agent_execution(
        agent_name="analytics_agent",
        task="content_analysis",
        decision="analytics_generated",
        metadata=analytics_result
    )

    state["completed_tasks"].append(
        "analytics_complete"
    )

    state["execution_timeline"].append({
        "agent": "analytics_agent",
        "event": "completed",
        "timestamp": datetime.utcnow().isoformat()
    })

    return state
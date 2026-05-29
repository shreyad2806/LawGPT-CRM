def build_dashboard_response(state):
    tool_results = state.get("tool_results", {})

    return {
        "status": state.get("execution_status"),
        "completed_tasks": state.get("completed_tasks", []),
        "trend": tool_results.get("trend_data"),
        "strategy": tool_results.get("strategy_data"),
        "content": tool_results.get("content_data"),
        "analytics": tool_results.get("analytics_data"),
        "timeline": state.get("execution_timeline", [])
    }
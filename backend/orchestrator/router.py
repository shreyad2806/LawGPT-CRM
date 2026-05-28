def route_task(user_goal: str) -> str:

    goal = user_goal.lower()

    if "trend" in goal:
        return "trend_agent"

    elif "strategy" in goal:
        return "strategy_agent"

    return "trend_agent"
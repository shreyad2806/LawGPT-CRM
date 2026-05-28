from models.agent_state import AgentState


def strategy_agent(state: AgentState) -> AgentState:

    tool_results = state.get("tool_results", {})

    trend_data = tool_results.get("trend_data", {})

    strategy = {
        "content_angle": "AI legal automation growth",
        "platform": "LinkedIn",
        "priority": "high"
    }

    tool_results["strategy_data"] = strategy

    state["tool_results"] = tool_results

    completed = state.get("completed_tasks", [])

    completed.append("strategy_complete")

    state["completed_tasks"] = completed

    return state
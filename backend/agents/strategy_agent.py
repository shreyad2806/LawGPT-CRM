from models.agent_state import AgentState


def strategy_agent(state: AgentState) -> AgentState:

    trend_data = state["tool_results"].get(
        "trend_data",
        {}
    )

    strategy = {
        "content_angle": "AI + Legal Automation",
        "target_audience": "Legal startups",
        "cta_strategy": "Book AI consultation",
        "platform": "LinkedIn",
        "tone": "Professional"
    }

    state["tool_results"]["strategy"] = strategy

    state["completed_tasks"].append(
        "strategy_complete"
    )

    return state
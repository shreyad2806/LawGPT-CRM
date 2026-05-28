from tools.trend_tool import trigger_trend_workflow
from typing import Dict, Any


from models.agent_state import AgentState

def trend_agent(state: AgentState):
    """Run trend research tool and update the shared agent state."""

    result = trigger_trend_workflow()

    # ensure keys exist
    state.setdefault("tool_results", {})
    state.setdefault("completed_tasks", [])

    state["tool_results"]["trend_data"] = result
    state["completed_tasks"].append("trend_research_complete")

    return state
from langgraph.graph import StateGraph
from models.agent_state import AgentState

from agents.trend_agent import trend_agent


builder = StateGraph(AgentState)


def _trend_node_adapter(state: AgentState, config=None):
    """Adapter to match langgraph runnable signature: (state, config) -> state

    Delegates to the project `trend_agent` which expects a plain dict-like state.
    """

    return trend_agent(dict(state))


builder.add_node("trend_agent", _trend_node_adapter)

builder.set_entry_point(
    "trend_agent"
)

builder.set_finish_point(
    "trend_agent"
)

graph = builder.compile()
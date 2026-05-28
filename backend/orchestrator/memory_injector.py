from services.memory_service import fetch_recent_memory
from models.agent_state import AgentState


def inject_memory(
    state: AgentState,
    agent_name: str
) -> AgentState:

    memory = fetch_recent_memory(agent_name)

    state["memory_context"] = {
        "recent_memory": memory
    }

    return state
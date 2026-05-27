from typing import TypedDict, Dict, List, Any


class AgentState(TypedDict):

    user_goal: str

    current_task: str

    completed_tasks: List[str]

    memory_context: Dict[str, Any]

    tool_results: Dict[str, Any]

    next_action: str
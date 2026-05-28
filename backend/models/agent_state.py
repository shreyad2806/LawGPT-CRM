from typing import TypedDict, Dict, Any, List


class AgentState(TypedDict, total=False):

    user_goal: str

    current_task: str

    completed_tasks: List[str]

    memory_context: Dict[str, Any]

    tool_results: Dict[str, Any]

    next_action: str

    execution_status: str

    error: str

    trend_agent_retries: int

    strategy_agent_retries: int
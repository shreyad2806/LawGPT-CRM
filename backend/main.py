from models.agent_state import AgentState
from orchestrator.main_orchestrator import run_orchestrator
from pprint import pprint

initial_state: AgentState = {
    "user_goal": "Find AI legal trends",
    "current_task": "trend research",
    "completed_tasks": [],
    "memory_context": {},
    "tool_results": {},
    "next_action": "",
    "execution_status": ""
}

result = run_orchestrator(initial_state)

print("\nFINAL RESULT:\n")

pprint(result["tool_results"])
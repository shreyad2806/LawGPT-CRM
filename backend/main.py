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

from pprint import pprint

from utils.execution_formatter import (
    print_summary
)

from utils.dashboard_response import (
    build_dashboard_response
)

print_summary(result)

dashboard_response = (
    build_dashboard_response(
        result
    )
)

print(
    "\nDASHBOARD RESPONSE:\n"
)

from pprint import pprint

pprint(dashboard_response)

from agents.lead_discovery_agent import (
    lead_discovery_agent
)

state = {
    "tool_results": {},
    "completed_tasks": []
}

result = lead_discovery_agent(state)

print(result)
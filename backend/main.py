from graph.main_graph import graph
from models.agent_state import AgentState


initial_state: AgentState = {

    "user_goal": "Find AI legal trends",

    "current_task": "trend research",

    "completed_tasks": [],

    "memory_context": {},

    "tool_results": {},

    "next_action": ""
}

result = graph.invoke(initial_state)

print("\nFINAL RESULT:\n")

print(result)
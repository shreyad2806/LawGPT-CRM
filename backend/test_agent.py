from agents.trend_agent import trend_agent

state = {

    "user_goal": "Find AI legal trends",

    "current_task": "trend research",

    "completed_tasks": [],

    "memory_context": {},

    "tool_results": {},

    "next_action": ""
}

result = trend_agent(state)

print(result)

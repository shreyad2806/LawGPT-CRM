from models.agent_state import AgentState
from services.strategy_memory import save_strategy_memory

def strategy_agent(state: AgentState) -> AgentState:

    tool_results = state.get("tool_results", {})

    trend_data = tool_results.get("trend_data", {})

    strategy = {

        "target_audience": [
            "Legal tech founders",
            "Law firms",
            "AI startup operators"
        ],

        "pain_points": [
            "manual legal workflows",
            "high operational costs",
            "slow contract review",
            "inefficient compliance tracking"
        ],

        "campaign_angle":
            "How AI is transforming legal operations",

        "recommended_content": [
            "LinkedIn carousel",
            "Founder insight thread",
            "AI workflow demo",
            "Case-study post"
        ],

        "platform": "LinkedIn",

        "priority": "high"
    }

    # SAVE INSIDE STATE
    tool_results["strategy_data"] = strategy

    state["tool_results"] = tool_results

    # SAVE MEMORY
    save_strategy_memory(strategy)

    # NOTE: Do not enqueue strategy into the content queue here.
    # Content queue expects a generated content schema with a
    # 'linkedin_post' key. The content agent is responsible for
    # producing content_data and enqueuing it.

    # TRACK COMPLETION
    completed = state.get("completed_tasks", [])

    completed.append("strategy_complete")

    state["completed_tasks"] = completed

    return state
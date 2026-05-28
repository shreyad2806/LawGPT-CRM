from models.agent_state import AgentState

from agents.trend_agent import trend_agent
from agents.strategy_agent import strategy_agent

from orchestrator.router import route_task
from orchestrator.supervisor import evaluate_execution
from orchestrator.retry_handler import retry_agent
from orchestrator.memory_injector import inject_memory


def run_orchestrator(state: AgentState) -> AgentState:

    route = route_task(state["user_goal"])

    # TREND AGENT
    if route == "trend_agent":

        state = inject_memory(
            state,
            "trend_agent"
        )

        state = retry_agent(
            trend_agent,
            state
        )

    # STRATEGY AGENT
    elif route == "strategy_agent":

        state = inject_memory(
            state,
            "strategy_agent"
        )

        state = retry_agent(
            strategy_agent,
            state
        )

    # SUPERVISOR
    status = evaluate_execution(state)

    state["execution_status"] = status

    return state
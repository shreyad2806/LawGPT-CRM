from models.agent_state import AgentState

from agents.trend_agent import trend_agent
from agents.strategy_agent import strategy_agent

from orchestrator.router import route_task
from orchestrator.supervisor import evaluate_execution
from orchestrator.retry_handler import retry_with_backoff
from orchestrator.memory_injector import inject_memory


def run_orchestrator(state: AgentState) -> AgentState:

    # ROUTER
    route = route_task(
        state.get("user_goal", "")
    )

    # =========================
    # TREND AGENT
    # =========================
    if route == "trend_agent":

        # Inject memory
        state = inject_memory(
            state,
            "trend_agent"
        )

        # Retry wrapper
        state, retries = retry_with_backoff(
            lambda: trend_agent(state)
        )

        state["trend_agent_retries"] = retries

    # =========================
    # STRATEGY AGENT
    # =========================
    elif route == "strategy_agent":

        # Inject memory
        state = inject_memory(
            state,
            "strategy_agent"
        )

        # Retry wrapper
        state, retries = retry_with_backoff(
            lambda: strategy_agent(state)
        )

        state["strategy_agent_retries"] = retries

    # =========================
    # UNKNOWN ROUTE
    # =========================
    else:

        state["error"] = (
            f"No agent found for route: {route}"
        )

    # =========================
    # SUPERVISOR
    # =========================
    status = evaluate_execution(state)

    state["execution_status"] = status

    return state
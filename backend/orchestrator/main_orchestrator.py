from models.agent_state import AgentState

from agents.trend_agent import trend_agent
from agents.strategy_agent import strategy_agent
from agents.content_agent import content_agent

from orchestrator.router import route_task
from orchestrator.supervisor import evaluate_execution
from orchestrator.memory_injector import inject_memory
from orchestrator.retry_handler import retry_with_backoff


def run_orchestrator(state: AgentState) -> AgentState:

    route = route_task(state.get("user_goal", " "))

    # =========================
    # TREND AGENT
    # =========================

    if route == "trend_agent":

        state = inject_memory(
            state,
            "trend_agent"
        )

        state, retries = retry_with_backoff(

            lambda: trend_agent(state)

        )

        state["trend_agent_retries"] = retries

    # =========================
    # STRATEGY AGENT
    # =========================

    state = inject_memory(
        state,
        "strategy_agent"
    )

    state, retries = retry_with_backoff(

        lambda: strategy_agent(state)

    )

    state["strategy_agent_retries"] = retries

    # =========================
    # CONTENT AGENT
    # =========================

    state = inject_memory(
        state,
        "content_agent"
    )

    state, retries = retry_with_backoff(

        lambda: content_agent(state)

    )

    state["content_agent_retries"] = retries

    # =========================
    # SUPERVISOR
    # =========================

    status = evaluate_execution(state)

    state["execution_status"] = status

    return state
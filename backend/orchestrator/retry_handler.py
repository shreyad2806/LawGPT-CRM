from typing import Callable
from models.agent_state import AgentState
import time


MAX_RETRIES = 3


def retry_agent(
    agent_function: Callable,
    state: AgentState
) -> AgentState:

    retries = 0

    while retries < MAX_RETRIES:

        try:
            result = agent_function(state)

            # success
            return result

        except Exception as e:

            retries += 1

            print(f"Retry {retries} failed: {e}")

            time.sleep(2)

    # final failure
    state["execution_status"] = "failed"

    state["tool_results"]["error"] = (
        f"Agent failed after {MAX_RETRIES} retries"
    )

    return state
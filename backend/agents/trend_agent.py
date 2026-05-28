from tools.trend_tool import trigger_trend_workflow
from tools.trend_tool import trigger_trend_workflow
from orchestrator.retry_handler import retry_with_backoff

from services.logger_service import (
    log_workflow_run,
    log_agent_execution
)

from services.memory_store import save_memory

import time


def trend_agent(state):

    start_time = time.time()

    result, retries = retry_with_backoff(
        trigger_trend_workflow
    )

    duration = time.time() - start_time

    success = not result.get("error")

    status = "success" if success else "failed"

    state["tool_results"]["trend_data"] = result

    # WORKFLOW LOG

    log_workflow_run(
    workflow_name="trend_automation",
    status=status,
    input_data={
        "task": "trend research"
    },
    output_data=result
)

    # AGENT LOG

    log_agent_execution(
    agent_name="trend_agent",
    task="trend research",
    decision=status,
    metadata=result
)

    # SAVE MEMORY

    if success:

        save_memory(
            agent_name="trend_agent",
            memory_type="trend_result",
            memory_data=result
        )

    state["completed_tasks"].append(
        "trend_research_complete"
    )

    return state
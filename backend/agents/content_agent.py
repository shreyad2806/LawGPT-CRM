from services.logger_service import (
    log_workflow_run,
    log_agent_execution
)

from services.content_queue_service import (
    enqueue_generated_content
)

from services.memory_store import save_memory

import time
from datetime import datetime

def content_agent(state):
    
    state.setdefault("execution_timeline", [])

    state["execution_timeline"].append({
        "agent": "content_agent",
        "event": "started",
        "timestamp": datetime.utcnow().isoformat()
    })

    start_time = time.time()

    strategy_data = (
        state["tool_results"]["strategy_data"]
    )

    content_data = {

        "linkedin_post": (
            f"AI is transforming legal operations.\n\n"
            f"{strategy_data['campaign_angle']}\n\n"
            f"Firms adopting AI workflows today will dominate tomorrow."
        ),

        "hook": (
            f"{strategy_data['campaign_angle']}"
        ),

        "cta": (
            "What legal workflow would you automate first?"
        ),

        "hashtags": [
            "#AI",
            "#LegalTech",
            "#Automation",
            "#LawGPT"
        ],

        "carousel_outline": [
            "Problem in legal workflows",
            "How AI changes operations",
            "Benefits of automation",
            "Future of AI legal systems"
        ]
    }

    # SAVE TO STATE
    state["tool_results"]["content_data"] = content_data

    # SAVE MEMORY
    save_memory(
        agent_name="content_agent",
        memory_type="generated_content",
        memory_data=content_data
    )

    # SAVE TO CONTENT QUEUE
    # Enqueue generated content (content_agent produces content_data)
    enqueue_generated_content(content_data)

    duration = time.time() - start_time

    # LOG WORKFLOW
    workflow_resp = log_workflow_run(
        workflow_name="content_generation",
        status="success",
        input_data=strategy_data,
        output_data=content_data
    )
    # workflow_resp contains DB response; we don't print raw DB responses.

    # LOG AGENT
    agent_resp = log_agent_execution(
        agent_name="content_agent",
        task="generate_content",
        decision="content_generated",
        metadata={
            "duration": duration
        }
    )
    # agent_resp contains DB response; we don't print raw DB responses.

    state["completed_tasks"].append(
        "content_generation_complete"
    )
    
    state["execution_timeline"].append({
        "agent": "content_agent",
        "event": "completed",
        "timestamp": datetime.utcnow().isoformat()
    })

    return state
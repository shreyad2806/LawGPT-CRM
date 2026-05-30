from datetime import datetime

from services.comment_service import (
    fetch_post_comments
)

from services.lead_service import (
    save_lead
)

from services.logger_service import (
    log_workflow_run,
    log_agent_execution
)


def lead_discovery_agent(state):

    timeline = state.setdefault(
        "execution_timeline",
        []
    )

    timeline.append({

        "agent":
            "lead_discovery_agent",

        "event":
            "started",

        "timestamp":
            datetime.utcnow().isoformat()
    })

    comments = fetch_post_comments()

    discovered_leads = []

    for comment in comments:
        lead = {
            "name": comment.get("name"),
            "company": comment.get("company"),
            "role": comment.get("role"),
            "platform": comment.get("platform"),
            "profile_url": comment.get("profile_url"),
            "engagement_type": "comment",
            "discovery_source": "post_comment",
            "lead_score": comment.get("lead_score"),
            "lead_category": comment.get("lead_category"),
            "status": "new",
            "notes": comment.get("comment") or comment.get("notes")
        }

        print("LEAD TO SAVE:", lead)

        save_lead(lead)

        discovered_leads.append(lead)

    state["tool_results"][
        "lead_discovery_data"
    ] = {

        "discovered_leads":
            discovered_leads
    }

    state["completed_tasks"].append(
        "lead_discovery_complete"
    )

    log_workflow_run(
        workflow_name=
            "lead_discovery",

        status="success",

        input_data={},

        output_data={
            "leads":
                len(discovered_leads)
        }
    )

    log_agent_execution(
        agent_name=
            "lead_discovery_agent",

        task=
            "discover_leads",

        decision=
            "completed",

        metadata={
            "count":
                len(discovered_leads)
        }
    )

    timeline.append({

        "agent":
            "lead_discovery_agent",

        "event":
            "completed",

        "timestamp":
            datetime.utcnow().isoformat()
    })

    return state
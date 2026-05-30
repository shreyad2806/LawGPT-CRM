from datetime import datetime
from typing import Dict, Any, List

from services.lead_service import (
    get_new_leads,
    update_lead
)

from services.qualification_service import (
    score_lead
)


def lead_qualification_agent(state):

    # ==========================
    # TIMELINE START
    # ==========================

    timeline = state.setdefault(
        "execution_timeline",
        []
    )

    timeline.append({
        "agent": "lead_qualification_agent",
        "event": "started",
        "timestamp": datetime.utcnow().isoformat()
    })

    # ==========================
    # FETCH LEADS
    # ==========================

    leads = get_new_leads()

    qualified_leads: List[Dict[str, Any]] = []

    # Ensure state containers exist
    state.setdefault("tool_results", {})
    state.setdefault("completed_tasks", [])

    # ==========================
    # SCORE EACH LEAD
    # ==========================

    for lead in leads:
        if not isinstance(lead, dict):
            continue

        score, status, reasons = score_lead(lead)

        qualification_reason = ", ".join(reasons)

        # Update local object
        lead["qualification_score"] = score
        lead["qualification_status"] = status
        lead["qualification_reason"] = qualification_reason

        # ==========================
        # UPDATE SUPABASE (safe conversion)
        # ==========================

        lead_id = lead.get("id")
        lid = None
        try:
            if isinstance(lead_id, int):
                lid = lead_id
            elif isinstance(lead_id, float):
                lid = int(lead_id)
            elif isinstance(lead_id, str) and lead_id.isdigit():
                lid = int(lead_id)
            elif lead_id is not None:
                # best-effort conversion
                lid = int(lead_id)
        except Exception:
            lid = None

        if lid is not None:
            update_lead(
                lid,
                {
                    "qualification_score": score,
                    "qualification_status": status,
                    "qualification_reason": qualification_reason,
                },
            )

        qualified_leads.append(lead)

    # ==========================
    # STORE IN STATE
    # ==========================

    state["tool_results"]["qualified_leads"] = qualified_leads

    state["completed_tasks"].append("lead_qualification_complete")

    # ==========================
    # TIMELINE END
    # ==========================

    timeline.append({
        "agent": "lead_qualification_agent",
        "event": "completed",
        "timestamp": datetime.utcnow().isoformat()
    })

    return state
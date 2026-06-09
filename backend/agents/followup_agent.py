from services.lead_service import get_all_leads
from services.followup_service import save_followup


def generate_followup(lead):

    name = lead.get("name", "there")

    company = lead.get("company", "")

    reason = lead.get(
        "qualification_reason",
        ""
    )

    return f"""
Hi {name},

I noticed your interest in legal AI and compliance.

We're building LawGPT for Indian legal professionals.

{reason}

Would love to connect and learn more about your workflow.

Best,
LawGPT Team
""".strip()


def followup_agent(state):

    leads = state.get(
        "qualified_leads",
        []
    )

    generated = []

    for lead in leads:

        message = generate_followup(
            lead
        )

        save_followup({

            "lead_id":
                lead["id"],

            "followup_message":
                message,

            "followup_type":
                "linkedin_dm"

        })

        generated.append({

            "lead_id":
                lead["id"],

            "message":
                message

        })

    state["followups"] = generated

    state["completed_tasks"].append(
        "followup_complete"
    )

    return state
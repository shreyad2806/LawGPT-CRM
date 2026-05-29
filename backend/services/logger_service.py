from services.supabase_client import supabase
from datetime import datetime


def log_workflow_run(
    workflow_name: str,
    status: str,
    input_data: dict,
    output_data: dict
):

    data = {
        "workflow_name": workflow_name,
        "status": status,
        "input_data": input_data,
        "output_data": output_data,
        "created_at": datetime.utcnow().isoformat()
    }

    return (
        supabase
        .table("workflow_runs")
        .insert(data)
        .execute()
    )


def log_agent_execution(
    agent_name: str,
    task: str,
    decision: str,
    metadata: dict
):

    data = {
        "agent_name": agent_name,
        "task": task,
        "decision": decision,
        "metadata": metadata,
        "created_at": datetime.utcnow().isoformat()
    }

    return (
        supabase
        .table("agent_logs")
        .insert(data)
        .execute()
    )
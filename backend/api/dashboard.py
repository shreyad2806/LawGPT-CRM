from typing import Dict, Any
from services.supabase_client import supabase


def get_dashboard_stats() -> Dict[str, Any]:
    """
    Get dashboard statistics from Supabase tables.
    
    Returns:
        Dict containing:
        - trendsAnalyzed: number of trends analyzed
        - contentGenerated: number of content items generated
        - qualifiedLeads: number of qualified leads
        - followupsPending: number of pending followups
    """
    
    # Get content generated count from content_queue table
    content_response = (
        supabase
        .table("content_queue")
        .select("id", count="exact")
        .execute()
    )
    content_generated = content_response.count if content_response.count else 0

    # Count generated infographics (non-null infographic_url)
    try:
        infographics_response = (
            supabase
            .table("content_queue")
            .select("id", count="exact")
            .not_("infographic_url", "is", None)
            .execute()
        )
        infographics_generated = infographics_response.count if infographics_response.count else 0
    except Exception:
        infographics_generated = 0
    
    # Get qualified leads count from leads table
    # Qualified leads are those with qualification_status = 'qualified' or status = 'qualified'
    qualified_leads_response = (
        supabase
        .table("leads")
        .select("id", count="exact")
        .or_("qualification_status.eq.qualified,status.eq.qualified")
        .execute()
    )
    qualified_leads = qualified_leads_response.count if qualified_leads_response.count else 0
    
    # Get pending followups count from lead_followups table
    # Pending followups are those with status = 'pending' or 'ready'
    followups_response = (
        supabase
        .table("lead_followups")
        .select("id", count="exact")
        .or_("status.eq.pending,status.eq.ready")
        .execute()
    )
    followups_pending = followups_response.count if followups_response.count else 0
    
    # Get trends analyzed count
    # This could be stored in a separate table or calculated from execution history
    # For now, we'll query an execution_history table if it exists, otherwise return 0
    try:
        trends_response = (
            supabase
            .table("execution_history")
            .select("id", count="exact")
            .execute()
        )
        trends_analyzed = trends_response.count if trends_response.count else 0
    except Exception:
        # If execution_history table doesn't exist, return 0
        trends_analyzed = 0
    
    return {
        "trendsAnalyzed": trends_analyzed,
        "contentGenerated": content_generated,
        "infographicsGenerated": infographics_generated,
        "qualifiedLeads": qualified_leads,
        "followupsPending": followups_pending
    }

from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.lead_service import get_all_leads, save_lead, update_lead, delete_lead

router = APIRouter()


class LeadCreate(BaseModel):
    name: str
    company: str
    role: str
    platform: str
    profile_url: str
    engagement_type: str = None
    discovery_source: str = None
    discovery_from_post: str = None
    lead_score: int = 0
    lead_category: str = None
    lead_quality: str = None
    reason: str = None
    status: str = "new"
    qualification_score: int = 0
    qualification_status: str = None
    qualification_reason: str = None


class LeadUpdate(BaseModel):
    name: str = None
    company: str = None
    role: str = None
    platform: str = None
    profile_url: str = None
    engagement_type: str = None
    discovery_source: str = None
    discovery_from_post: str = None
    lead_score: int = None
    lead_category: str = None
    lead_quality: str = None
    reason: str = None
    status: str = None
    qualification_score: int = None
    qualification_status: str = None
    qualification_reason: str = None


@router.get("/")
async def get_leads() -> Dict[str, Any]:
    """Get all leads from Supabase"""
    try:
        leads = get_all_leads()
        return {
            "success": True,
            "data": leads,
            "count": len(leads)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_lead(lead: LeadCreate) -> Dict[str, Any]:
    """Create a new lead in Supabase"""
    try:
        lead_data = lead.model_dump()
        result = save_lead(lead_data)
        return {
            "success": True,
            "data": result.data[0] if result.data else None,
            "message": "Lead created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{lead_id}")
async def update_lead_endpoint(lead_id: int, lead: LeadUpdate) -> Dict[str, Any]:
    """Update an existing lead in Supabase"""
    try:
        # Filter out None values
        update_data = {k: v for k, v in lead.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = update_lead(lead_id, update_data)
        
        if result is None:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        return {
            "success": True,
            "data": result.data[0] if result.data else None,
            "message": "Lead updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{lead_id}")
async def delete_lead_endpoint(lead_id: int) -> Dict[str, Any]:
    """Delete a lead from Supabase"""
    try:
        result = delete_lead(lead_id)
        return {
            "success": True,
            "message": "Lead deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

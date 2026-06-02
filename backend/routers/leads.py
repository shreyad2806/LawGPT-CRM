from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from services.lead_service import get_all_leads as get_all_leads_service, save_lead
from services.qualification_service import score_lead

router = APIRouter()

class LeadItem(BaseModel):
    name: str
    company: str
    role: str
    platform: str
    engagement: str
    score: int
    category: str
    status: str

class CreateLeadRequest(BaseModel):
    name: str
    company: str
    role: str
    platform: str
    profile_url: str

@router.get("/")
async def get_all_leads() -> Dict[str, Any]:
    """Get all leads"""
    try:
        print("GET /api/leads called")
        leads = get_all_leads_service()
        print(f"Lead count: {len(leads)}")

        # Transform database fields to match frontend schema
        transformed_leads = []
        for item in leads:
            # Determine engagement level based on lead_score
            lead_score = item.get("lead_score", 0) or item.get("qualification_score", 0) or 0
            if lead_score >= 80:
                engagement = "High"
            elif lead_score >= 50:
                engagement = "Medium"
            else:
                engagement = "Low"

            transformed_leads.append({
                "id": str(item.get("id", "")),
                "name": item.get("name", ""),
                "company": item.get("company", ""),
                "role": item.get("role", ""),
                "platform": item.get("platform", ""),
                "engagement": engagement,
                "score": int(lead_score),
                "category": item.get("lead_category", ""),
                "status": item.get("status", "New")
            })

        print(f"Transformed leads count: {len(transformed_leads)}")
        return {"leads": transformed_leads}
    except Exception as e:
        print(f"Error in GET /api/leads: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch leads: {str(e)}")

@router.post("/")
async def create_lead(request: CreateLeadRequest) -> Dict[str, Any]:
    """Create new lead"""
    try:
        # Map frontend request to database schema
        lead_data = {
            "name": request.name,
            "company": request.company,
            "role": request.role,
            "platform": request.platform,
            "profile_url": request.profile_url,
            "status": "new",
            "lead_score": 0,
            "lead_category": "",
            "engagement_type": "manual"
        }

        result = save_lead(lead_data)

        if result and len(result) > 0:
            created_item = result[0]
            lead_score = created_item.get("lead_score", 0) or 0

            return {
                "id": str(created_item.get("id", "")),
                "name": created_item.get("name", request.name),
                "company": created_item.get("company", request.company),
                "role": created_item.get("role", request.role),
                "platform": created_item.get("platform", request.platform),
                "profile_url": created_item.get("profile_url", request.profile_url),
                "score": int(lead_score),
                "status": created_item.get("status", "New")
            }

        return {
            "id": "new_id",
            "name": request.name,
            "company": request.company,
            "role": request.role,
            "platform": request.platform,
            "profile_url": request.profile_url,
            "score": 0,
            "status": "New"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create lead: {str(e)}")

@router.get("/stats")
async def get_leads_stats() -> Dict[str, Any]:
    """Get leads statistics"""
    try:
        leads = get_all_leads_service()

        total = len(leads)
        qualified = 0
        pending = 0
        rejected = 0

        for item in leads:
            status = item.get("status", "").lower()
            qualification_status = item.get("qualification_status", "").lower()

            if status == "qualified" or qualification_status == "qualified":
                qualified += 1
            elif status == "new" or status == "pending":
                pending += 1
            elif status == "rejected" or qualification_status == "cold":
                rejected += 1

        return {
            "total": total,
            "qualified": qualified,
            "pending": pending,
            "rejected": rejected
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch lead stats: {str(e)}")

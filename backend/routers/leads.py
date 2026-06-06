from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from services.lead_service import get_all_leads as get_all_leads_service, save_lead, get_lead_by_id, update_lead
from services.qualification_service import score_lead
from services.lead_activity_service import get_lead_activities
from services.lead_service import LEAD_COLUMNS

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
                "status": item.get("status", "New"),
                "recommended_action": item.get("recommended_action", ""),
                "priority": item.get("priority", ""),
                "qualification_reason": item.get("qualification_reason", ""),
                "confidence": item.get("confidence", 0),
                "tags": item.get("tags", [])
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

@router.get("/{lead_id}")
async def get_lead(lead_id: int) -> Dict[str, Any]:
    """Get a single lead by ID"""
    try:
        print(f"GET /api/leads/{lead_id} called")
        lead = get_lead_by_id(lead_id)
        
        if not lead:
            raise HTTPException(status_code=404, detail=f"Lead with id {lead_id} not found")
        
        print(f"Lead found: {lead.get('name', 'Unknown')}")
        return lead
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in GET /api/leads/{lead_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch lead: {str(e)}")


@router.get("/{lead_id}/activities")
async def get_lead_activities_endpoint(lead_id: int) -> Dict[str, Any]:
    """Get all activities for a lead"""
    try:
        print(f"GET /api/leads/{lead_id}/activities called")
        activities = get_lead_activities(lead_id)
        print(f"Found {len(activities)} activities")
        return {"activities": activities}
    except Exception as e:
        print(f"Error in GET /api/leads/{lead_id}/activities: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch activities: {str(e)}")


@router.get("/search")
async def search_leads(query: str = "") -> Dict[str, Any]:
    """Search leads across multiple fields with ranking."""
    try:
        print(f"GET /api/leads/search called with query: {query}")
        
        if not query or query.strip() == "":
            # Return all leads if no query
            leads = get_all_leads_service()
            transformed_leads = []
            for item in leads:
                lead_score = item.get("lead_score", 0)
                engagement = item.get("discovery_source", "")
                
                transformed_leads.append({
                    "id": str(item.get("id", "")),
                    "name": item.get("name", ""),
                    "company": item.get("company", ""),
                    "role": item.get("role", ""),
                    "platform": item.get("platform", ""),
                    "engagement": engagement,
                    "score": int(lead_score),
                    "category": item.get("lead_category", ""),
                    "status": item.get("status", "New"),
                    "recommended_action": item.get("recommended_action", ""),
                    "priority": item.get("priority", ""),
                    "qualification_reason": item.get("qualification_reason", ""),
                    "confidence": item.get("confidence", 0),
                    "tags": item.get("tags", [])
                })
            return {"leads": transformed_leads}
        
        # Get all leads
        leads = get_all_leads_service()
        
        # Search and rank results
        search_results = []
        query_lower = query.lower().strip()
        
        for item in leads:
            score = 0
            matched_fields = []
            
            # Search in name (highest weight)
            name = item.get("name", "")
            if name and query_lower in name.lower():
                score += 10
                matched_fields.append("name")
            
            # Search in company (high weight)
            company = item.get("company", "")
            if company and query_lower in company.lower():
                score += 8
                matched_fields.append("company")
            
            # Search in role (medium weight)
            role = item.get("role", "")
            if role and query_lower in role.lower():
                score += 6
                matched_fields.append("role")
            
            # Search in recommended_action (medium weight)
            recommended_action = item.get("recommended_action", "")
            if recommended_action and query_lower in recommended_action.lower():
                score += 5
                matched_fields.append("recommended_action")
            
            # Search in tags (medium weight)
            tags = item.get("tags", [])
            if tags:
                for tag in tags:
                    if query_lower in tag.lower():
                        score += 4
                        matched_fields.append("tags")
                        break
            
            # Search in reason (low weight)
            reason = item.get("reason", "")
            if reason and query_lower in reason.lower():
                score += 3
                matched_fields.append("reason")
            
            # Search in qualification_reason (low weight)
            qualification_reason = item.get("qualification_reason", [])
            if qualification_reason:
                for qr in qualification_reason:
                    if query_lower in str(qr).lower():
                        score += 2
                        matched_fields.append("qualification_reason")
                        break
            
            # Only include if there's a match
            if score > 0:
                lead_score = item.get("lead_score", 0)
                engagement = item.get("discovery_source", "")
                
                search_results.append({
                    "id": str(item.get("id", "")),
                    "name": item.get("name", ""),
                    "company": item.get("company", ""),
                    "role": item.get("role", ""),
                    "platform": item.get("platform", ""),
                    "engagement": engagement,
                    "score": int(lead_score),
                    "category": item.get("lead_category", ""),
                    "status": item.get("status", "New"),
                    "recommended_action": item.get("recommended_action", ""),
                    "priority": item.get("priority", ""),
                    "qualification_reason": item.get("qualification_reason", ""),
                    "confidence": item.get("confidence", 0),
                    "tags": item.get("tags", []),
                    "search_score": score,
                    "matched_fields": matched_fields
                })
        
        # Sort by search score (descending)
        search_results.sort(key=lambda x: x["search_score"], reverse=True)
        
        print(f"Search returned {len(search_results)} results")
        return {"leads": search_results}
    except Exception as e:
        print(f"Error in GET /api/leads/search: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search leads: {str(e)}")


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


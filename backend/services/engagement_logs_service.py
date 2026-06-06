from typing import Any, Dict, List, Optional
from services.supabase_client import supabase
from services.vision_service import extract_from_screenshot
import os
from openai import OpenAI


ENGAGEMENT_LOGS_COLUMNS = {
    "id",
    "platform",
    "engagement_type",
    "person_name",
    "company",
    "role",
    "message",
    "source_post_id",
    "source_post_title",
    "source_post_url",
    "intent",
    "lead_score",
    "lead_quality",
    "ai_summary",
    "recommended_action",
    "converted_to_lead",
    "created_at"
}


def map_source_to_platform_engagement(source: str) -> tuple[str, str]:
    """Map source to platform and engagement_type."""
    source_mapping = {
        "Comment": ("linkedin", "comment"),
        "Message": ("linkedin", "dm"),
        "Email": ("email", "inquiry"),
        "Referral": ("referral", "referral"),
        "Manual": ("manual", "prospect"),
        "Other": ("other", "other"),
    }
    return source_mapping.get(source, ("other", "other"))


def get_engagement_logs() -> List[Dict[str, Any]]:
    """Get all engagement logs."""
    try:
        response = supabase.table("engagement_logs").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"[engagement_logs_service] Error fetching engagement logs: {e}")
        return []


def create_engagement_log(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new engagement log."""
    try:
        print("[engagement_logs_service] create_engagement_log called with:", data)
        
        # Extract vision data if screenshot is provided
        screenshot_data = data.get("screenshot_data")
        vision_extracted = {}
        
        if screenshot_data:
            print("[engagement_logs_service] Running AI Vision extraction on screenshot")
            try:
                vision_extracted = extract_from_screenshot(screenshot_data)
                print("[engagement_logs_service] Vision extracted:", vision_extracted)
            except ValueError as e:
                # Vision extraction failed - return error to user
                print(f"[engagement_logs_service] Vision extraction failed: {e}")
                raise ValueError(f"Could not extract information from screenshot. Please review the screenshot and try again, or manually enter the information. Error: {str(e)}")
            except Exception as e:
                print(f"[engagement_logs_service] Unexpected error during vision extraction: {e}")
                raise ValueError(f"Vision extraction encountered an error. Please try again or manually enter the information. Error: {str(e)}")
        
        # Map frontend payload to database columns
        source = data.get("source", "Other")
        platform, engagement_type = map_source_to_platform_engagement(source)
        
        # Prefer manual values, fall back to vision extracted values
        person_name = data.get("person_name") or vision_extracted.get("person_name")
        company = data.get("company") or vision_extracted.get("company")
        role = data.get("role") or vision_extracted.get("role")
        message = data.get("message") or vision_extracted.get("message")
        
        # Extract AI analysis fields from vision extraction if available
        intent = vision_extracted.get("intent")
        lead_score = vision_extracted.get("lead_score")
        lead_quality = vision_extracted.get("lead_quality")
        ai_summary = vision_extracted.get("ai_summary")
        recommended_action = vision_extracted.get("recommended_action")
        
        insert_data = {
            "platform": platform,
            "engagement_type": engagement_type,
            "person_name": person_name,
            "company": company,
            "role": role,
            "message": message,
            "source_post_url": data.get("post_url"),
            "converted_to_lead": False,
        }
        
        # Add AI analysis fields if available from vision (only if they exist in schema)
        if intent and "intent" in ENGAGEMENT_LOGS_COLUMNS:
            insert_data["intent"] = intent
        if lead_score is not None and "lead_score" in ENGAGEMENT_LOGS_COLUMNS:
            insert_data["lead_score"] = lead_score
        if lead_quality and "lead_quality" in ENGAGEMENT_LOGS_COLUMNS:
            insert_data["lead_quality"] = lead_quality
        if ai_summary and "ai_summary" in ENGAGEMENT_LOGS_COLUMNS:
            insert_data["ai_summary"] = ai_summary
        if recommended_action and "recommended_action" in ENGAGEMENT_LOGS_COLUMNS:
            insert_data["recommended_action"] = recommended_action
        
        # Filter insert_data to only include columns that exist in ENGAGEMENT_LOGS_COLUMNS
        insert_data = {k: v for k, v in insert_data.items() if k in ENGAGEMENT_LOGS_COLUMNS}
        
        # Remove None values
        insert_data = {k: v for k, v in insert_data.items() if v is not None}
        
        print("INSERT DATA:", insert_data)
        response = supabase.table("engagement_logs").insert(insert_data).execute()
        print("[engagement_logs_service] SUPABASE RESPONSE:", response.data)
        return response.data[0] if response.data else {}
    except ValueError as e:
        # Re-raise ValueError as-is (these are our custom errors)
        raise
    except Exception as e:
        print(f"[engagement_logs_service] SUPABASE ERROR: {e}")
        print(f"[engagement_logs_service] Error creating engagement log: {e}")
        # Return detailed error information
        raise Exception(f"Failed to create engagement log: {str(e)}. Insert data: {insert_data if 'insert_data' in locals() else 'N/A'}")


def update_engagement_log(engagement_id: int, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update an engagement log."""
    try:
        print(f"[engagement_logs_service] update_engagement_log called id={engagement_id} updates={updates}")
        
        # Filter updates to only include valid columns
        valid_updates = {k: v for k, v in updates.items() if k in ENGAGEMENT_LOGS_COLUMNS and v is not None}
        
        print("[engagement_logs_service] UPDATE DATA:", valid_updates)
        response = supabase.table("engagement_logs").update(valid_updates).eq("id", engagement_id).execute()
        print("[engagement_logs_service] SUPABASE RESPONSE:", response.data)
        return response.data[0] if response.data else {}
    except Exception as e:
        print(f"[engagement_logs_service] SUPABASE ERROR: {e}")
        print(f"[engagement_logs_service] Error updating engagement log: {e}")
        raise


def delete_engagement_log(engagement_id: int) -> bool:
    """Delete an engagement log."""
    try:
        print(f"[engagement_logs_service] delete_engagement_log called id={engagement_id}")
        response = supabase.table("engagement_logs").delete().eq("id", engagement_id).execute()
        print("[engagement_logs_service] SUPABASE RESPONSE:", response.data)
        return True
    except Exception as e:
        print(f"[engagement_logs_service] SUPABASE ERROR: {e}")
        print(f"[engagement_logs_service] Error deleting engagement log: {e}")
        raise


def analyze_engagement(message: str, source: str) -> Dict[str, Any]:
    """Analyze engagement message using AI to determine intent, lead score, lead quality, ai_summary, and recommended_action."""
    try:
        print("[engagement_logs_service] Running AI analysis on message")
        
        # Initialize OpenAI client
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            print("[engagement_logs_service] OPENAI_API_KEY not found, using fallback analysis")
            return _fallback_analysis(message, source)
        
        client = OpenAI(api_key=openai_api_key)
        
        # Build prompt for AI analysis
        prompt = f"""
Analyze the following engagement message and provide a lead qualification assessment.

Message: "{message}"
Source: {source}

Please provide a JSON response with the following fields:
1. intent: The primary intent of the message (e.g., "Demo Request", "Pricing Inquiry", "Partnership", "General Engagement", "Support Request")
2. lead_score: A score from 0-100 indicating lead quality and likelihood to convert
3. lead_quality: Categorize as "Hot", "Warm", or "Cold"
4. ai_summary: A brief summary of the engagement (1-2 sentences)
5. recommended_action: The best next step (e.g., "Schedule demo call", "Send pricing information", "Add to nurture sequence")

Scoring guidelines:
- 90-100: Strong purchase intent, explicit request for demo/trial/pricing
- 70-89: High interest, asking detailed questions, potential partnership
- 50-69: Moderate interest, general inquiry, needs nurturing
- 30-49: Low engagement, vague interest
- 0-29: No clear intent, spam, or irrelevant

Return only valid JSON.
"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a lead qualification expert. Analyze engagement messages and provide structured JSON output."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content
        print("[engagement_logs_service] AI analysis result:", result_text)
        
        # Parse JSON response
        import json
        analysis = json.loads(result_text)
        
        return {
            "intent": analysis.get("intent", "Unknown"),
            "lead_score": analysis.get("lead_score", 50),
            "lead_quality": analysis.get("lead_quality", "Cold"),
            "ai_summary": analysis.get("ai_summary", ""),
            "recommended_action": analysis.get("recommended_action", "Review and respond")
        }
        
    except Exception as e:
        print(f"[engagement_logs_service] AI analysis error: {e}, using fallback")
        return _fallback_analysis(message, source)


def _fallback_analysis(message: str, source: str) -> Dict[str, Any]:
    """Fallback keyword-based analysis when AI is unavailable."""
    message_lower = message.lower()
    
    # Determine intent based on keywords
    intent = "Unknown"
    if any(word in message_lower for word in ["interested", "want", "need", "looking", "considering"]):
        intent = "Interested"
    elif any(word in message_lower for word in ["question", "help", "how", "what", "why"]):
        intent = "Inquiry"
    elif any(word in message_lower for word in ["pricing", "cost", "price", "quote"]):
        intent = "Pricing"
    elif any(word in message_lower for word in ["demo", "trial", "test", "try"]):
        intent = "Demo Request"
    elif any(word in message_lower for word in ["partnership", "collaborate", "together"]):
        intent = "Partnership"
    
    # Calculate lead score based on message length and intent
    lead_score = 50  # Base score
    if intent == "Interested":
        lead_score += 30
    elif intent == "Pricing":
        lead_score += 25
    elif intent == "Demo Request":
        lead_score += 35
    elif intent == "Partnership":
        lead_score += 20
    
    # Bonus for longer messages
    if len(message) > 200:
        lead_score += 10
    elif len(message) > 100:
        lead_score += 5
    
    # Cap score at 100
    lead_score = min(lead_score, 100)
    
    # Determine lead quality based on lead score
    if lead_score >= 80:
        lead_quality = "Hot"
    elif lead_score >= 60:
        lead_quality = "Warm"
    else:
        lead_quality = "Cold"
    
    # Generate ai_summary
    ai_summary = f"Detected {intent} intent from {source}. "
    if lead_score >= 80:
        ai_summary += "High engagement level with strong purchase signals."
    elif lead_score >= 60:
        ai_summary += "Moderate engagement with potential interest."
    else:
        ai_summary += "Low engagement, requires nurturing."
    
    # Generate recommended_action
    recommended_action = "Review and respond"
    if intent == "Pricing":
        recommended_action = "Send pricing information"
    elif intent == "Demo Request":
        recommended_action = "Schedule demo call"
    elif intent == "Partnership":
        recommended_action = "Schedule partnership discussion"
    elif lead_score >= 80:
        recommended_action = "Immediate follow-up required"
    elif lead_score >= 60:
        recommended_action = "Follow up within 24 hours"
    else:
        recommended_action = "Add to nurture sequence"
    
    return {
        "intent": intent,
        "lead_score": lead_score,
        "lead_quality": lead_quality,
        "ai_summary": ai_summary,
        "recommended_action": recommended_action
    }


def create_lead_from_engagement(engagement_data: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Create a lead from engagement data and analysis."""
    try:
        print("[engagement_logs_service] create_lead_from_engagement called with:", engagement_data, analysis)
        
        # Map engagement source to discovery_source
        source = engagement_data.get("source", "Engagement")
        discovery_source_mapping = {
            "Comment": "LinkedIn Comment",
            "Message": "LinkedIn DM",
            "Email": "Email",
            "Referral": "Referral",
            "Manual": "Manual Entry",
            "Other": "Other",
        }
        discovery_source = discovery_source_mapping.get(source, "Engagement")
        
        # Build lead_data using only columns that exist in the leads table
        lead_data = {
            "name": engagement_data.get("person_name") or "Unknown",
            "company": engagement_data.get("company") or "",
            "role": engagement_data.get("role") or "",
            "platform": "linkedin",  # Default platform
            "discovery_source": discovery_source,
            "status": "new",
            "lead_score": analysis.get("lead_score", 50),
            "lead_quality": analysis.get("lead_quality", "Cold"),
            "reason": f"Created from engagement: {engagement_data.get('message', '')[:200]}",
        }
        
        # Remove None values
        lead_data = {k: v for k, v in lead_data.items() if v is not None and v != ""}
        
        print("[engagement_logs_service] INSERT LEAD DATA:", lead_data)
        response = supabase.table("leads").insert(lead_data).execute()
        print("[engagement_logs_service] SUPABASE RESPONSE:", response.data)
        return response.data[0] if response.data else {}
    except Exception as e:
        print(f"[engagement_logs_service] SUPABASE ERROR: {e}")
        print(f"[engagement_logs_service] Error creating lead from engagement: {e}")
        raise


def save_engagement_with_analysis(data: Dict[str, Any]) -> Dict[str, Any]:
    """Save engagement with analysis and lead creation workflow."""
    try:
        print("[engagement_logs_service] save_engagement_with_analysis called with:", data)
        
        # STEP 1: Create engagement_logs record (Vision extraction is handled in create_engagement_log)
        engagement = create_engagement_log(data)
        print("[engagement_logs_service] Engagement created:", engagement)
        
        # STEP 2: Check if AI analysis was already provided by vision extraction
        # Vision extraction provides: intent, lead_score, lead_quality, reason, ai_summary, recommended_action
        has_vision_analysis = all([
            engagement.get("intent"),
            engagement.get("lead_score") is not None,
            engagement.get("lead_quality"),
            engagement.get("ai_summary")
        ])
        
        if has_vision_analysis:
            print("[engagement_logs_service] Vision extraction provided AI analysis, skipping separate analysis")
            analysis = {
                "intent": engagement.get("intent"),
                "lead_score": engagement.get("lead_score"),
                "lead_quality": engagement.get("lead_quality"),
                "ai_summary": engagement.get("ai_summary"),
                "recommended_action": engagement.get("recommended_action")
            }
        else:
            # STEP 2b: Run AI analysis only if message exists and vision didn't provide analysis
            message = engagement.get("message", "")
            source = engagement.get("platform", "Unknown")
            
            if message:
                analysis = analyze_engagement(message, source)
                print("[engagement_logs_service] Analysis result:", analysis)
                
                # Update engagement with analysis results
                update_data = {
                    "intent": analysis.get("intent"),
                    "lead_score": analysis.get("lead_score"),
                    "lead_quality": analysis.get("lead_quality"),
                    "ai_summary": analysis.get("ai_summary"),
                    "recommended_action": analysis.get("recommended_action")
                }
                updated_engagement = update_engagement_log(engagement["id"], update_data)
                print("[engagement_logs_service] Engagement updated with analysis:", updated_engagement)
            else:
                # No message available - don't create analysis or lead
                print("[engagement_logs_service] No message available, skipping analysis and lead creation")
                return {
                    "engagement": engagement,
                    "lead": None,
                    "analysis": None
                }
        
        # STEP 3: Automatically create lead (only if analysis exists and score is reasonable)
        if analysis and analysis.get("lead_score", 0) > 30:
            lead = create_lead_from_engagement(engagement, analysis)
            print("[engagement_logs_service] Lead created:", lead)
        else:
            lead = None
            print("[engagement_logs_service] Lead score too low or no analysis, skipping lead creation")
        
        # STEP 4: Update engagement_logs with converted_to_lead = true (only if lead was created)
        if lead and lead.get("id"):
            update_data = {"converted_to_lead": True}
            final_engagement = update_engagement_log(engagement["id"], update_data)
            print("[engagement_logs_service] Engagement marked as converted:", final_engagement)
        else:
            final_engagement = engagement
        
        return {
            "engagement": final_engagement,
            "lead": lead,
            "analysis": analysis
        }
    except ValueError as e:
        # Re-raise ValueError as-is (these are our custom errors from vision extraction)
        raise
    except Exception as e:
        print(f"[engagement_logs_service] Error in save_engagement_with_analysis: {e}")
        raise

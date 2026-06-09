import os
import json
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from openai import OpenAI
from services.sdr_memory_service import log_workflow_run

def recalculate_priority(
    lead_score: int, 
    intent: str, 
    days_since_contact: int, 
    status: str,
    engagement_level: str = "Unknown"
) -> str:
    """
    Recalculate dynamic priority based on lead score, intent, days since contact, status, and engagement.
    Returns: 'Critical', 'High', 'Medium', or 'Low'.
    """
    if status == "Completed":
        return "Low"
        
    score = 0
    
    # Base on lead score (0-100)
    if lead_score >= 80:
        score += 40
    elif lead_score >= 60:
        score += 25
    elif lead_score >= 40:
        score += 10
        
    # Base on intent
    high_intent = ["Pricing", "Demo Request", "Interested"]
    medium_intent = ["Inquiry", "Partnership"]
    if intent in high_intent:
        score += 30
    elif intent in medium_intent:
        score += 15
        
    # Base on days since last contact
    if days_since_contact > 7:
        score += 10 # Nurture needed
    elif days_since_contact >= 3 and days_since_contact <= 7:
        score += 20 # Followup window
    elif days_since_contact < 3:
        score += 5
        
    # Base on engagement
    if engagement_level == "Hot":
        score += 10
    elif engagement_level == "Warm":
        score += 5
        
    if score >= 80:
        return "Critical"
    elif score >= 60:
        return "High"
    elif score >= 40:
        return "Medium"
    return "Low"


def generate_ai_reply(
    lead: Dict[str, Any],
    engagement_message: str,
    ai_summary: str,
    intent: str,
    memory_context: str = "",
) -> str:
    """
    Generate an AI reply for the followup.
    """

    openai_api_key = os.getenv("OPENAI_API_KEY")

    fallback_reply = (
        "Thank you for reaching out! "
        "We are currently reviewing your request and will get back to you shortly."
    )

    if not openai_api_key:
        return fallback_reply

    client = OpenAI(api_key=openai_api_key)

    company_context = lead.get("company", "our company")
    person_name = lead.get("name") or lead.get("person_name") or "there"

    prompt = f"""
You are an expert sales representative for LawGPT CRM.

Write a professional, concise, and engaging reply.

Lead Name: {person_name}
Lead Company: {company_context}
Original Message:
{engagement_message}

AI Summary:
{ai_summary}

Intent:
{intent}

{memory_context}

Guidelines:

- Pricing -> mention customized pricing and offer pricing sheet.
- Demo Request -> encourage scheduling a demo.
- Inquiry -> answer politely and ask one qualifying question.
- Professional and friendly tone.
- Sign off as "Best, LawGPT Team".

Return ONLY the reply.
"""

    try:

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional SDR for LawGPT CRM.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.6,
        )

        content = response.choices[0].message.content

        if content is None:
            return fallback_reply

        return content.strip()

    except Exception as e:
        print(f"[followup_ai_service] Error generating AI reply: {e}")
        return fallback_reply


def generate_ai_recommendation(
    lead: Dict[str, Any], 
    last_action: str = "None"
) -> Dict[str, Any]:
    """
    Generate an AI recommendation for the next action.
    Returns a dict with: recommended_action, next_action, ai_reason, priority, suggested_next_date.
    """
    openai_api_key = os.getenv("OPENAI_API_KEY")
    
    lead_score = lead.get("lead_score", 50)
    intent = lead.get("intent", "Unknown")
    quality = lead.get("lead_quality", "Warm")
    
    if not openai_api_key:
        # Fallback logic
        priority = recalculate_priority(lead_score, intent, 0, "Needs Response", quality)
        return {
            "recommended_action": "Follow up with lead",
            "next_action": "Email",
            "ai_reason": "Fallback logic based on lead score.",
            "priority": priority,
            "suggested_next_date": (datetime.utcnow() + timedelta(days=2)).isoformat()
        }
        
    client = OpenAI(api_key=openai_api_key)
    
    prompt = f"""
    Analyze the lead and provide the next best action for our sales team.
    
    Lead Quality: {quality}
    Lead Score: {lead_score}/100
    Intent: {intent}
    Last Action Taken: {last_action}
    
    Provide a JSON response with:
    1. recommended_action: A short phrase describing the action (e.g., "Schedule Demo", "Send Pricing", "Wait 3 Days", "Close Lead", "Reconnect").
    2. next_action: A 1-2 word category (e.g., "Email", "Call", "Wait", "Close").
    3. ai_reason: 1-2 sentences explaining why this is the best next step.
    4. suggested_days_to_wait: Integer representing how many days from now the action should happen (0 for today).
    
    Return ONLY valid JSON.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a sales strategy AI determining the best next steps for leads."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content or "{}"

        analysis = json.loads(result_text or "{}")
        days_to_wait = analysis.get("suggested_days_to_wait", 2)
        next_date = (datetime.utcnow() + timedelta(days=days_to_wait)).isoformat()
        
        priority = recalculate_priority(lead_score, intent, days_to_wait, "Pending", quality)
        
        return {
            "recommended_action": analysis.get("recommended_action", "Follow up"),
            "next_action": analysis.get("next_action", "Email"),
            "ai_reason": analysis.get("ai_reason", "Based on lead score and intent."),
            "priority": priority,
            "suggested_next_date": next_date
        }
    except Exception as e:
        print(f"[followup_ai_service] Error generating recommendation: {e}")
        return {
            "recommended_action": "Follow up with lead",
            "next_action": "Email",
            "ai_reason": f"Error calling AI: {str(e)}",
            "priority": "Medium",
            "suggested_next_date": (datetime.utcnow() + timedelta(days=2)).isoformat()
        }

def generate_coaching_panel(lead: Dict[str, Any], conversation_history: str) -> Dict[str, Any]:
    """
    Generate an AI coaching panel returning summary, pain point, buying intent, urgency, objection prediction, recommended strategy, next objective, and confidence.
    """
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        return {
            "summary": "AI unavailable.",
            "pain_point": "Unknown",
            "buying_intent": "Unknown",
            "urgency": "Low",
            "objection_prediction": "Price or timing.",
            "recommended_strategy": "Reach out directly to establish relationship.",
            "next_objective": "Get a meeting booked.",
            "confidence": 0
        }
        
    client = OpenAI(api_key=openai_api_key)
    
    prompt = f"""
    You are an expert Sales Development Representative (SDR) manager. Analyze this lead and their conversation history.
    
    Lead Name: {lead.get('name')}
    Company: {lead.get('company')}
    Lead Score: {lead.get('lead_score', 0)}/100
    History:
    {conversation_history}
    
    Provide a JSON response with the following keys:
    1. summary: A brief summary of where the deal stands.
    2. pain_point: The core problem the lead is trying to solve.
    3. buying_intent: High, Medium, or Low with a 1-sentence justification.
    4. urgency: High, Medium, or Low with a 1-sentence justification.
    5. objection_prediction: What is the most likely objection they will raise?
    6. recommended_strategy: 1-2 sentences on the exact angle to use next.
    7. next_objective: The specific goal for the very next interaction.
    8. confidence: Integer 0-100 indicating confidence in this assessment.
    
    Return ONLY valid JSON.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a senior SDR manager AI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content

        if result_text is None:
         return {
        "summary": "",
        "coaching": [],
        "next_step": ""
    }

        analysis = json.loads(result_text)
        log_workflow_run(lead.get('id', 0), "generate_coaching_panel", {"history_length": len(conversation_history)}, analysis)
        
        return analysis
    except Exception as e:
        print(f"[followup_ai_service] Error generating coaching panel: {e}")
        return {
            "summary": "Error generating insights.",
            "pain_point": "Unknown",
            "buying_intent": "Unknown",
            "urgency": "Unknown",
            "objection_prediction": "Unknown",
            "recommended_strategy": "Try manual review.",
            "next_objective": "Unknown",
            "confidence": 0
        }

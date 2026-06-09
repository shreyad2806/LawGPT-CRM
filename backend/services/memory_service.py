from typing import Dict, Any, List, Optional
import os
import json
from openai import OpenAI
from services.supabase_client import supabase, safe_insert, safe_update


def store_conversation(
    lead_id: int,
    sender: str,
    message: str
):
    try:

        # Schema: id, lead_id, sender, message, created_at, timestamp
        payload = {
            "lead_id": lead_id,
            "sender": sender,
            "message": message
        }

        print("STORE MEMORY PAYLOAD")
        print(payload)

        res = (
            supabase
            .table("conversation_memory")
            .insert(payload)
            .execute()
        )

        print("MEMORY INSERT RESPONSE")
        print(res.data)

        return res.data

    except Exception as e:
        print("========== MEMORY INSERT ERROR ==========")
        print(e)

        import traceback
        traceback.print_exc()

        return None


def get_conversation_history(
    lead_id: int,
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Get last N conversation messages for a lead, ordered by newest first.
    Returns empty list on failure.
    Schema: id, lead_id, sender, message, created_at, timestamp
    """
    try:
        response = (
            supabase.table("conversation_memory")
            .select("*")
            .eq("lead_id", lead_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )

        print("GET MEMORY RESPONSE")
        print(response.data)

        return response.data or []
    except Exception as e:
        print(f"[memory_service] Error getting conversation history: {e}")
        return []


def extract_memory(
    conversation_text: str
) -> Dict[str, Any]:
    """
    Use GPT-4o-mini to extract memory from conversation text.
    Returns empty dict on failure.
    """
    try:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            print("[memory_service] OPENAI_API_KEY not found")
            return {}

        client = OpenAI(api_key=openai_api_key)

        prompt = f"""
Extract the following information from this conversation. Return ONLY valid JSON.

Conversation:
{conversation_text}

Extract these fields:
- summary: Brief summary of the conversation
- buying_intent: High, Medium, or Low
- urgency: High, Medium, or Low
- pain_point: Main problem or need expressed
- objection: Any objections raised
- decision_maker: Is this person the decision maker?
- budget: Budget mentioned or range
- preferred_communication: Email, phone, LinkedIn, etc.
- last_action: What was the last action taken
- next_action: Recommended next action

Return ONLY valid JSON with these exact keys.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a sales intelligence extractor. Extract structured data from conversations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )

        result_text = response.choices[0].message.content
        if result_text:
            return json.loads(result_text)
        return {}
    except Exception as e:
        print(f"[memory_service] Error extracting memory: {e}")
        return {}


def update_lead_memory_summary(
    lead_id: int,
    memory: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Upsert memory summary into lead_memory_summary table.
    Only overwrites existing values when new value is non-blank.
    Returns empty dict on failure.
    """
    try:
        # Check if record exists
        existing = (
            supabase.table("lead_memory_summary")
            .select("*")
            .eq("lead_id", lead_id)
            .execute()
        )

        # Build payload, only including non-blank values
        payload = {"lead_id": lead_id}

        if existing.data:
            # For existing records, only update non-blank values
            existing_record = existing.data[0]
            payload["summary"] = memory.get("summary") or existing_record.get("summary", "")
            payload["buying_intent"] = memory.get("buying_intent") or existing_record.get("buying_intent", "")
            payload["urgency"] = memory.get("urgency") or existing_record.get("urgency", "")
            payload["pain_point"] = memory.get("pain_point") or existing_record.get("pain_point", "")
            payload["objection"] = memory.get("objection") or existing_record.get("objection", "")
            payload["decision_maker"] = memory.get("decision_maker") or existing_record.get("decision_maker", "")
            payload["budget"] = memory.get("budget") or existing_record.get("budget", "")
            payload["preferred_communication"] = memory.get("preferred_communication") or existing_record.get("preferred_communication", "")
            payload["last_action"] = memory.get("last_action") or existing_record.get("last_action", "")
            payload["next_action"] = memory.get("next_action") or existing_record.get("next_action", "")
        else:
            # For new records, include all values (even blank)
            payload["summary"] = memory.get("summary", "")
            payload["buying_intent"] = memory.get("buying_intent", "")
            payload["urgency"] = memory.get("urgency", "")
            payload["pain_point"] = memory.get("pain_point", "")
            payload["objection"] = memory.get("objection", "")
            payload["decision_maker"] = memory.get("decision_maker", "")
            payload["budget"] = memory.get("budget", "")
            payload["preferred_communication"] = memory.get("preferred_communication", "")
            payload["last_action"] = memory.get("last_action", "")
            payload["next_action"] = memory.get("next_action", "")

        if existing.data:
            # Update existing
            response = (
                supabase.table("lead_memory_summary")
                .update(payload)
                .eq("lead_id", lead_id)
                .execute()
            )
            if response.data:
                return response.data[0]
        else:
            # Insert new
            response = safe_insert("lead_memory_summary", payload)
            if response.data:
                return response.data[0]

        return {}
    except Exception as e:
        print(f"[memory_service] Error updating lead memory summary: {e}")
        return {}


def get_lead_memory(
    lead_id: int
) -> Dict[str, Any]:
    """
    Get memory summary for a lead.
    Returns empty dict on failure.
    """
    try:
        response = (
            supabase.table("lead_memory_summary")
            .select("*")
            .eq("lead_id", lead_id)
            .execute()
        )
        if response.data:
            return response.data[0]
        return {}
    except Exception as e:
        print(f"[memory_service] Error getting lead memory: {e}")
        return {}


def store_memory_event(
    lead_id: int,
    event_type: str,
    value: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Store a memory event into memory_events table.
    Returns empty dict on failure.
    """
    try:
        payload = {
            "lead_id": lead_id,
            "event_type": event_type,
            "value": value,
            "metadata": metadata or {}
        }
        response = safe_insert("memory_events", payload)
        if response.data:
            return response.data[0]
        return {}
    except Exception as e:
        print(f"[memory_service] Error storing memory event: {e}")
        return {}
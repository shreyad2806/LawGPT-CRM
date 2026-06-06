from typing import Any, Dict, Optional
import base64
import os
from openai import OpenAI


class VisionService:
    """Service for extracting information from screenshots using OpenAI Vision API."""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def extract_from_screenshot(self, image_data: bytes) -> Dict[str, Any]:
        """
        Extract person_name, company, role, message, intent, lead_score, lead_quality, reason, summary, and recommended_action from a screenshot.
        
        Args:
            image_data: Bytes of the image file
            
        Returns:
            Dict with extracted fields: person_name, company, role, message, intent, lead_score, lead_quality, reason, summary, recommended_action
        """
        try:
            print("[vision_service] Starting AI Vision extraction")
            
            # Convert bytes to base64
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            # Build prompt for vision extraction
            prompt = """
Analyze this screenshot of a LinkedIn engagement or message and extract all visible information.

Please provide a JSON response with the following fields:
1. person_name: The name of the person who sent the message or commented
2. company: The company they work at (infer from context if not explicitly shown, e.g., "We work with PI Law firms" → company = "PI Law Firms")
3. role: Their job title or role
4. message: The full text of their message or comment
5. intent: The primary intent of the message. Choose from: "Product Inquiry", "Demo Request", "Partnership", "Pricing Inquiry", "Job Inquiry", "General Engagement", "Support Request", "Networking"
6. lead_score: A score from 0-100 indicating lead quality and likelihood to convert
7. lead_quality: Categorize as "Hot", "Warm", or "Cold"
8. ai_summary: A one-line summary of the engagement
9. recommended_action: The best next step for an SDR (e.g., "Schedule demo call", "Send pricing information", "Add to nurture sequence", "Request partnership meeting")

Intent Detection Guidelines:
- Product Inquiry: Asking about features, capabilities, or how the product works (e.g., "Wondering how we can leverage LawGPT for our clients")
- Demo Request: Explicit request for demo, trial, or product walkthrough
- Partnership: Proposing collaboration, partnership, or business relationship
- Pricing Inquiry: Asking about costs, pricing plans, or quotes
- Job Inquiry: Asking about job openings, hiring, or career opportunities
- General Engagement: General comments, likes, or non-specific interactions
- Support Request: Asking for help, support, or technical assistance
- Networking: Connecting, networking, or building professional relationships

Scoring Guidelines:
- 90-100: Strong purchase intent, explicit request for demo/trial/pricing, decision-maker (e.g., "Can we leverage LawGPT for our clients?")
- 70-89: High interest, asking detailed questions, potential partnership, mid-level decision maker
- 50-69: Moderate interest, general inquiry, needs nurturing, junior role
- 30-49: Low engagement, vague interest, informational only
- 0-29: No clear intent, spam, irrelevant, or competitor

Examples:
- "We work with PI Law firms in the US. Wondering how we can leverage LawGPT for our clients." → intent: Product Inquiry, lead_score: 95, lead_quality: Hot, recommended_action: Schedule Demo
- "Can you send me pricing?" → intent: Pricing Inquiry, lead_score: 85, lead_quality: Warm, recommended_action: Send pricing information
- "Are you hiring?" → intent: Job Inquiry, lead_score: 20, lead_quality: Cold, recommended_action: No action needed

IMPORTANT:
- If you cannot confidently extract a field, set it to null (not "N/A", "Unknown", or empty string)
- Infer company from context when possible (e.g., "We help law firms with X" → company = "Law Firms")
- Extract the full message text, not just a summary
- Be specific about the recommended action
- Use AI reasoning to determine intent, not just keyword matching

Return only valid JSON.
"""
            
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert AI SDR assistant. Analyze LinkedIn engagement screenshots and extract structured information for lead qualification."
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            result_text = response.choices[0].message.content
            print("[vision_service] Vision extraction result:", result_text)
            
            # Parse JSON response
            import json
            extracted = json.loads(result_text)
            
            # Validate that we have meaningful data
            # If all critical fields are null, return error
            critical_fields = ["person_name", "company", "role", "message"]
            all_null = all(extracted.get(field) is None for field in critical_fields)
            
            if all_null:
                print("[vision_service] All critical fields are null, extraction failed")
                raise ValueError("Could not extract meaningful information from screenshot")
            
            # Clean up null values - convert to None
            cleaned = {}
            for key, value in extracted.items():
                if value is None or value == "" or value == "N/A" or value == "Unknown":
                    cleaned[key] = None
                else:
                    cleaned[key] = value
            
            print("[vision_service] Extracted info:", cleaned)
            return cleaned
            
        except Exception as e:
            print(f"[vision_service] Error during vision extraction: {e}")
            raise ValueError(f"Vision extraction failed: {str(e)}")


# Singleton instance
vision_service = VisionService()


def extract_from_screenshot(image_data: bytes) -> Dict[str, Any]:
    """
    Extract information from a screenshot using AI Vision.
    
    Args:
        image_data: Bytes of the image file
        
    Returns:
        Dict with extracted fields: person_name, company, role, message, intent, lead_score, lead_quality, reason, summary, recommended_action
    """
    return vision_service.extract_from_screenshot(image_data)

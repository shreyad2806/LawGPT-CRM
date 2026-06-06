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
8. score_reason: An array of 3-5 bullet points explaining why this score was given (e.g., ["mentions law firm", "asks product usage", "high buying intent", "decision maker"])
9. ai_summary: A one-line summary of the engagement
10. recommended_action: The best next step for an SDR. Choose from: "Schedule Demo", "Send Pricing", "Send Case Study", "Connect on LinkedIn", "Send Product Deck", "Wait 3 Days", "Disqualify"
11. qualification_reason: An array of 3-5 bullet points explaining why this lead is qualified (e.g., ["Law Firm", "Managing Partner", "Product Inquiry", "High Intent"])
12. confidence: A confidence score from 0-100 indicating how confident the AI is in this qualification
13. tags: An array of relevant tags for this lead (e.g., ["lawfirm", "partner", "enterprise", "demo", "pricing", "startup", "legaltech"])

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

Score Reason Guidelines:
Provide 3-5 bullet points explaining the score. Consider:
- Industry relevance (e.g., "mentions law firm")
- Buying signals (e.g., "asks product usage", "high buying intent")
- Decision maker indicators (e.g., "decision maker", "C-level executive")
- Engagement quality (e.g., "asks detailed questions", "specific use case")
- Timing urgency (e.g., "immediate interest", "looking for solution now")

Recommended Action Guidelines:
Choose the best next step based on the message and lead quality:
- Schedule Demo: Strong purchase intent, explicit demo request, high-quality lead (score 70+)
- Send Pricing: Asking about costs, pricing plans, or budget
- Send Case Study: Interested in product but needs proof, asks about results or success stories
- Connect on LinkedIn: General networking, wants to stay in touch, low urgency
- Send Product Deck: Interested in features, wants more information about product capabilities
- Wait 3 Days: Moderate interest but not urgent, needs nurturing, or lead is busy
- Disqualify: No buying intent, job inquiry, spam, competitor, or irrelevant (score < 30)

Qualification Reason Guidelines:
Provide 3-5 bullet points explaining why this lead is qualified. Consider:
- Target industry (e.g., "Law Firm", "Legal Services")
- Decision maker role (e.g., "Managing Partner", "C-Level", "Director")
- Buying intent (e.g., "Product Inquiry", "Demo Request", "Pricing Inquiry")
- Engagement quality (e.g., "Specific Use Case", "Detailed Questions")
- Company size/type (e.g., "Large Firm", "Mid-sized", "Startup")

Confidence Guidelines:
Provide a confidence score from 0-100 based on:
- Clarity of message (clear intent = higher confidence)
- Completeness of information (name, company, role all present = higher confidence)
- Strength of buying signals (explicit request = higher confidence)
- Industry fit (target industry = higher confidence)
- Role fit (decision maker = higher confidence)

Tags Guidelines:
Generate relevant tags based on the engagement. Consider:
- Industry tags (e.g., "lawfirm", "legaltech", "legal", "legal-services")
- Company type (e.g., "enterprise", "startup", "mid-market", "small-business")
- Intent tags (e.g., "demo", "pricing", "partnership", "product-inquiry")
- Role tags (e.g., "c-level", "partner", "director", "manager")
- Engagement type (e.g., "linkedin", "comment", "message", "referral")

Common tags to use:
- lawfirm, legaltech, legal, legal-services
- enterprise, startup, mid-market, small-business
- demo, pricing, partnership, product-inquiry
- c-level, partner, director, manager
- linkedin, comment, message, referral

Examples:
- "We work with PI Law firms in the US. Wondering how we can leverage LawGPT for our clients." → 
  intent: Product Inquiry, lead_score: 95, lead_quality: Hot, score_reason: ["mentions law firm", "asks product usage", "high buying intent", "decision maker"], recommended_action: Schedule Demo, qualification_reason: ["Law Firm", "Managing Partner", "Product Inquiry", "High Intent"], confidence: 96, tags: ["lawfirm", "legaltech", "enterprise", "demo", "product-inquiry", "c-level"]
- "Can you send me pricing?" → 
  intent: Pricing Inquiry, lead_score: 85, lead_quality: Warm, score_reason: ["pricing inquiry", "specific budget question"], recommended_action: Send Pricing, qualification_reason: ["Pricing Inquiry", "Budget Discussion"], confidence: 85, tags: ["pricing", "product-inquiry"]
- "Are you hiring?" → 
  intent: Job Inquiry, lead_score: 20, lead_quality: Cold, score_reason: ["job inquiry", "no buying intent"], recommended_action: Disqualify, qualification_reason: ["Job Inquiry", "No Buying Intent"], confidence: 95, tags: ["job-inquiry"]
- "Great product! How does it work for small firms?" → 
  intent: Product Inquiry, lead_score: 75, lead_quality: Warm, score_reason: ["interested in product", "asks about use cases"], recommended_action: Send Product Deck, qualification_reason: ["Small Firm", "Product Inquiry", "Use Case Discussion"], confidence: 80, tags: ["small-business", "product-inquiry", "demo"]

IMPORTANT:
- If you cannot confidently extract a field, set it to null (not "N/A", "Unknown", or empty string)
- Infer company from context when possible (e.g., "We help law firms with X" → company = "Law Firms")
- Extract the full message text, not just a summary
- Use AI reasoning to determine intent, not just keyword matching
- score_reason must be an array of 3-5 bullet points
- recommended_action must be one of the specified options
- qualification_reason must be an array of 3-5 bullet points
- confidence must be a number from 0-100
- tags must be an array of 3-8 relevant tags (lowercase, no spaces, use hyphens for multi-word tags)

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

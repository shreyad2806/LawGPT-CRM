from typing import Any, Dict, Optional
import re
from PIL import Image
import pytesseract
import io


class OCRService:
    """Service for extracting information from screenshots using OCR."""
    
    def __init__(self):
        # Configure pytesseract path if needed (Windows)
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass
    
    def extract_from_image(self, image_data: bytes) -> Dict[str, Any]:
        """
        Extract person_name, company, role, and message from an image.
        
        Args:
            image_data: Bytes of the image file
            
        Returns:
            Dict with extracted fields: person_name, company, role, message
        """
        try:
            print("[ocr_service] Starting OCR extraction")
            
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Run OCR
            text = pytesseract.image_to_string(image)
            print("[ocr_service] OCR extracted text:", text[:500])
            
            # Extract information using regex patterns
            extracted = self._extract_info_from_text(text)
            
            print("[ocr_service] Extracted info:", extracted)
            return extracted
            
        except Exception as e:
            print(f"[ocr_service] Error during OCR extraction: {e}")
            return {
                "person_name": None,
                "company": None,
                "role": None,
                "message": None
            }
    
    def _extract_info_from_text(self, text: str) -> Dict[str, Any]:
        """
        Extract structured information from OCR text using regex patterns.
        
        Args:
            text: Raw OCR text
            
        Returns:
            Dict with extracted fields
        """
        text = text.strip()
        
        # Try to extract name (common patterns)
        name_patterns = [
            r'Name:\s*([^\n]+)',
            r'From:\s*([^\n]+)',
            r'([A-Z][a-z]+ [A-Z][a-z]+)',  # Simple name pattern
        ]
        
        person_name = None
        for pattern in name_patterns:
            match = re.search(pattern, text)
            if match:
                person_name = match.group(1).strip()
                if len(person_name.split()) >= 2:  # At least first and last name
                    break
        
        # Try to extract company
        company_patterns = [
            r'Company:\s*([^\n]+)',
            r'at\s+([A-Z][A-Za-z\s]+)',
            r'@([A-Z][A-Za-z]+)',
        ]
        
        company = None
        for pattern in company_patterns:
            match = re.search(pattern, text)
            if match:
                company = match.group(1).strip()
                if len(company) > 2:  # Minimum reasonable company name length
                    break
        
        # Try to extract role
        role_patterns = [
            r'Role:\s*([^\n]+)',
            r'Title:\s*([^\n]+)',
            r'(CEO|CTO|CFO|Manager|Director|VP|Vice President|Engineer|Developer|Consultant)',
        ]
        
        role = None
        for pattern in role_patterns:
            match = re.search(pattern, text)
            if match:
                role = match.group(1).strip()
                break
        
        # The message is typically the main body of text
        # Remove common headers/footers to get the actual message
        message = text
        
        # Remove common LinkedIn UI text
        message = re.sub(r'LinkedIn\s*\|.*', '', message, flags=re.IGNORECASE)
        message = re.sub(r'View\s+profile', '', message, flags=re.IGNORECASE)
        message = re.sub(r'Connect', '', message, flags=re.IGNORECASE)
        message = re.sub(r'Message', '', message, flags=re.IGNORECASE)
        message = re.sub(r'Comment', '', message, flags=re.IGNORECASE)
        message = re.sub(r'Like', '', message, flags=re.IGNORECASE)
        message = re.sub(r'Share', '', message, flags=re.IGNORECASE)
        
        # Clean up whitespace
        message = re.sub(r'\n+', ' ', message)
        message = re.sub(r'\s+', ' ', message)
        message = message.strip()
        
        # If message is too short, it might just be noise
        if len(message) < 10:
            message = None
        
        return {
            "person_name": person_name,
            "company": company,
            "role": role,
            "message": message
        }


# Singleton instance
ocr_service = OCRService()


def extract_from_screenshot(image_data: bytes) -> Dict[str, Any]:
    """
    Extract information from a screenshot using OCR.
    
    Args:
        image_data: Bytes of the image file
        
    Returns:
        Dict with extracted fields: person_name, company, role, message
    """
    return ocr_service.extract_from_image(image_data)

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import traceback

from services.infographic_service import generate_infographic_for_content

router = APIRouter()


@router.post("/{content_id}/generate-infographic")
async def generate_infographic(content_id: int) -> Dict[str, Any]:
    """Generate an AI infographic for a content item and return the stored URL."""
    try:
        print(f"[routers.infographic] generate_infographic called id={content_id}")

        try:
            url = generate_infographic_for_content(content_id)
        except ValueError as ve:
            # content not found
            print(f"[routers.infographic] value error: {ve}")
            raise HTTPException(status_code=404, detail="Content not found")
        except EnvironmentError as ee:
            print(f"[routers.infographic] env error: {ee}")
            raise HTTPException(status_code=500, detail=str(ee))
        except Exception as e:
            print(f"[routers.infographic] generation error: {e}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail="Failed to generate infographic")

        return {"infographic_url": url}

    except HTTPException:
        raise
    except Exception as e:
        print(f"[routers.infographic] unexpected error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/generate")
async def generate_infographic_body(body: Dict[str, Any]) -> Dict[str, Any]:
    """Accepts JSON body { content_id: <int> } for compatibility with frontend helper."""
    try:
        print(f"[routers.infographic] generate (body) called: {body}")
        content_id = body.get("content_id")
        if not content_id:
            raise HTTPException(status_code=400, detail="content_id is required")

        try:
            url = generate_infographic_for_content(int(content_id))
        except ValueError:
            raise HTTPException(status_code=404, detail="Content not found")
        except EnvironmentError as ee:
            print(f"[routers.infographic] env error: {ee}")
            raise HTTPException(status_code=500, detail=str(ee))
        except Exception as e:
            print(f"[routers.infographic] generation error: {e}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail="Failed to generate infographic")

        return {"infographic_url": url}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[routers.infographic] unexpected body error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")

import base64
import io
from fastapi import APIRouter, UploadFile, File
from services.rembg_service import remove_background

router = APIRouter()


@router.post("/segment")
async def segment_image(image: UploadFile = File(...)):
    """Segment an image into foreground and background layers."""
    input_bytes = await image.read()
    layers = remove_background(input_bytes)
    return layers

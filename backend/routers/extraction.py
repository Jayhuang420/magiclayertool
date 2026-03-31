from fastapi import APIRouter, UploadFile, File, HTTPException
from services.extraction_service import extract_images_from_pdf, extract_images_from_pptx

router = APIRouter()

SUPPORTED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
}


@router.post("/extract")
async def extract_layers(file: UploadFile = File(...)):
    """Extract embedded images from PDF or PPTX files."""
    content_type = file.content_type or ""
    filename = file.filename or ""

    file_type = SUPPORTED_TYPES.get(content_type)
    if not file_type:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        if ext == "pdf":
            file_type = "pdf"
        elif ext == "pptx":
            file_type = "pptx"
        else:
            raise HTTPException(status_code=400, detail="不支援的檔案格式，僅接受 PDF 和 PPTX")

    file_bytes = await file.read()

    try:
        if file_type == "pdf":
            layers = extract_images_from_pdf(file_bytes)
        else:
            layers = extract_images_from_pptx(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"提取失敗: {str(e)}")

    return layers

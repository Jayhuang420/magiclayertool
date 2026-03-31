from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import segmentation

app = FastAPI(title="MagicLayerTool Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(segmentation.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}

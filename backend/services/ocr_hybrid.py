"""
Hybrid OCR:  Azure Vision 4.0  → falls back to Tesseract when needed
"""

from pathlib import Path
import os, cv2, pytesseract

from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential

# Credentials come from environment variables (see .env)
VISION_KEY      = os.environ["AZURE_VISION_KEY"]
VISION_ENDPOINT = os.environ["AZURE_VISION_ENDPOINT"]

# ───────────────────────────────────────────────────────────────
def tesseract_fallback(img_path: Path) -> str:
    img  = cv2.imread(str(img_path))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.medianBlur(gray, 3)
    return pytesseract.image_to_string(blur)

# ───────────────────────────────────────────────────────────────
def extract_text(img_path: str | Path) -> str:
    """Run Azure Read 4.0; if <10 chars, call Tesseract."""
    img_path = Path(img_path)

    client = ImageAnalysisClient(
        endpoint=VISION_ENDPOINT,
        credential=AzureKeyCredential(VISION_KEY),
    )

    with open(img_path, "rb") as f:
        result = client.analyze(
            image_data=f,
            visual_features=[VisualFeatures.READ],
        )

    lines = result.read.blocks[0].lines if result.read and result.read.blocks else []
    text  = "\n".join(l.text for l in lines).strip()

    if len(text) < 10:
        print("⚠️  Azure OCR empty/short — using Tesseract")
        text = tesseract_fallback(img_path)
    else:
        print("✅  Azure OCR succeeded")

    return text

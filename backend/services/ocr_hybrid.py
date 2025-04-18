# ===== START PASTE =========================================================
"""
ocr_hybrid.py  ·  April 2025
--------------------------------------------------------------
Extract text from a local image with Azure AI Vision (Read 4.0)
and automatically fall back to Tesseract if Azure returns
nothing or very little text.
"""

from pathlib import Path
import os
import cv2
import pytesseract
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ─────────────────────────────────────────────────────────────
# 1)  Credentials from environment variables
# ─────────────────────────────────────────────────────────────
VISION_KEY = os.getenv("VISION_KEY")
VISION_ENDPOINT = os.getenv("VISION_ENDPOINT")

if not VISION_KEY or not VISION_ENDPOINT:
    raise EnvironmentError("Azure Vision credentials not found in environment variables")

# ─────────────────────────────────────────────────────────────
# 2)  Helper: Tesseract fallback
# ─────────────────────────────────────────────────────────────
def tesseract_fallback(img_path: Path) -> str:
    """Basic grayscale + median blur, then Tesseract OCR."""
    img  = cv2.imread(str(img_path))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.medianBlur(gray, 3)
    return pytesseract.image_to_string(blur)

# ─────────────────────────────────────────────────────────────
# 3)  Main extraction routine
# ─────────────────────────────────────────────────────────────
def extract_text(img_path: str | Path) -> str:
    """Run Azure Read 4.0. If text < 10 chars, fall back to Tesseract."""
    img_path = Path(img_path)
    if not img_path.exists():
        raise FileNotFoundError(img_path)

    client = ImageAnalysisClient(
        endpoint=VISION_ENDPOINT,
        credential=AzureKeyCredential(VISION_KEY),
    )

    with open(img_path, "rb") as f:
        result = client.analyze(
            image_data=f,
            visual_features=[VisualFeatures.READ],   # OCR only
        )

    # Flatten Azure output
    lines = result.read.blocks[0].lines if result.read and result.read.blocks else []
    text  = "\n".join(l.text for l in lines).strip()

    # Very crude quality gate: fewer than 10 chars → assume failure
    if len(text) < 10:
        print("⚠️  Azure OCR empty/short — switching to Tesseract")
        return tesseract_fallback(img_path)

    print("✅  Azure OCR succeeded")
    return text

# Optional: standalone test run
if __name__ == "__main__":
    sample = r"C:\Path\To\Some\image.jpg"
    print(extract_text(sample))
# ===== END PASTE =========================================================

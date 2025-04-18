"""
backend/venv/app.py
────────────────────────────────────────────────────────────────────
Flask back‑end for “The_system” repository
• Serves a health‑check at  GET  /
• Runs hybrid Azure Read 4.0 + Tesseract OCR at  POST  /ocr
   - Expects multipart/form‑data with a field named “file”
   - Returns JSON:  { "text": "<extracted text>" }
────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

# ───────────────────  standard library  ──────────────────────────
import os
import tempfile
import pathlib
from typing import Final

# ───────────────────  third‑party libs  ──────────────────────────
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ───────────────────  local modules  ─────────────────────────────
# make sure backend/__init__.py and backend/services/__init__.py exist
from backend.services.ocr_hybrid import extract_text


# ───────────────────  configuration  ─────────────────────────────
load_dotenv()                         # ➊ loads AZURE_VISION_* from .env

app: Final = Flask(__name__)
CORS(app)                             # allow front‑end at localhost:3001


# ───────────────────  routes  ────────────────────────────────────
@app.route("/", methods=["GET"])
def index() -> str:
    """Simple health‑check route."""
    return "✅  Internal‑AI‑Tool back‑end is running!", 200


@app.route("/ocr", methods=["POST"])
def ocr() -> tuple[dict, int]:
    """
    Multipart/form‑data endpoint.
    Field name MUST be “file” (front‑end sends it that way).
    """
    if "file" not in request.files:
        return {"error": "No 'file' field in form‑data"}, 400

    up_file = request.files["file"]
    if up_file.filename == "":
        return {"error": "Empty filename"}, 400

    # ── save to a temporary path ────────────────────────────────
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = pathlib.Path(tmp_dir) / up_file.filename
        up_file.save(tmp_path)

        # ── run hybrid OCR ───────────────────────────────────────
        try:
            text = extract_text(tmp_path)
        except Exception as exc:
            # Log here if desired: app.logger.exception(exc)
            return {"error": str(exc)}, 500

    # ── success ────────────────────────────────────────────────
    return {"text": text}, 200


# ───────────────────  launch in dev mode  ────────────────────────
if __name__ == "__main__":
    # Use 5000 so front‑end proxy hits http://localhost:5000/ocr
    app.run(debug=True, port=5000)

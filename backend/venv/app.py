"""
Flask back‑end for Internal‑AI‑Tool
Provides a single OCR endpoint:  POST  /api/ocr
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os, tempfile, pathlib, shutil

# Initialise environment variables (.env must live at project‑root)
load_dotenv()

# Import the hybrid OCR routine (Azure 4.0 + Tesseract fallback)
from backend.services.ocr_hybrid import extract_text

app = Flask(__name__)
CORS(app)                           # allow React dev server (localhost:3000)

# ───────────────────────────────────────────────────────────────
# Simple index route – handy for 'is the server up?' checks
# ───────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return "Internal‑AI‑Tool back‑end is running!"

# ───────────────────────────────────────────────────────────────
# OCR API  – expects multipart/form‑data field  “image”
# ───────────────────────────────────────────────────────────────
@app.route("/api/ocr", methods=["POST"])
def ocr():
    if "image" not in request.files:
        return jsonify({"error": "No file part named 'image'"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save to a temporary path
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = pathlib.Path(tmp_dir) / file.filename
        file.save(tmp_path)

        # Run OCR
        try:
            text = extract_text(tmp_path)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"text": text})

# ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # python backend/venv/app.py   ➜ dev mode
    app.run(debug=True, port=5000)

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

# NEW ↓
from services.ocr_hybrid import extract_text
import tempfile, pathlib
# NEW ↑

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Internal AI Tool Backend is Running!"

# NEW ↓  --- OCR endpoint ---
@app.route('/api/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    img_file = request.files['image']
    if img_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    with tempfile.NamedTemporaryFile(delete=False,
                                     suffix=pathlib.Path(img_file.filename).suffix) as tmp:
        img_file.save(tmp.name)
        text = extract_text(tmp.name)

    return jsonify({'text': text})
# NEW ↑ ----------------------

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    return jsonify({'reply': f"Echo: {data.get('message','')}"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

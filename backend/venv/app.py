# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS module

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return "Internal AI Tool Backend is Running!"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    # For now, echo the message back.
    return jsonify({'reply': f"Echo: {user_message}"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

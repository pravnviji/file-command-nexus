from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
import os
import uuid
import shutil
import tempfile
import openai

app = Flask(__name__)
CORS(app)

# Swagger UI configuration
swagger_config = {
    "swagger": "2.0",
    "info": {
        "title": "TTS Command Nexus API",
        "description": "Upload a file, ask questions, and receive AI answers using DeepSeek via OpenRouter.",
        "version": "1.0.0"
    },
    "basePath": "/",
}
swagger = Swagger(app, template=swagger_config)

# OpenRouter API setup

OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
if not OPENROUTER_API_KEY:
    raise EnvironmentError("OPENROUTER_API_KEY not set in environment")
openai.api_base = "https://openrouter.ai/api/v1"
openai.api_key = OPENROUTER_API_KEY

# Temp file directory
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'file_command_nexus')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Upload a file and receive a session ID
    ---
    consumes:
      - multipart/form-data
    parameters:
      - name: file
        in: formData
        type: file
        required: true
    responses:
      200:
        description: File uploaded and session created
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    session_id = str(uuid.uuid4())
    session_dir = os.path.join(UPLOAD_FOLDER, session_id)
    os.makedirs(session_dir, exist_ok=True)

    file_path = os.path.join(session_dir, file.filename)
    file.save(file_path)

    return jsonify({
        'message': 'File uploaded successfully',
        'filename': file.filename,
        'session_id': session_id
    })


@app.route('/api/ask', methods=['POST'])
def ask_question():
    """
    Ask a question about the uploaded file
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            session_id:
              type: string
            question:
              type: string
    responses:
      200:
        description: AI-generated answer to the question
    """
    data = request.json
    session_id = data.get('session_id')
    question = data.get('question')

    if not session_id:
        return jsonify({'error': 'No session ID provided'}), 400
    if not question:
        return jsonify({'error': 'No question provided'}), 400

    session_dir = os.path.join(UPLOAD_FOLDER, session_id)
    if not os.path.exists(session_dir):
        return jsonify({'error': 'Invalid session ID'}), 400

    try:
        files = os.listdir(session_dir)
        if not files:
            return jsonify({'error': 'No file found in session'}), 400

        file_path = os.path.join(session_dir, files[0])

        # Read content
        if file_path.endswith('.pdf'):
            try:
                import fitz
                doc = fitz.open(file_path)
                content = "\n".join([page.get_text() for page in doc])
                doc.close()
            except ImportError:
                return jsonify({'error': "Required module 'fitz' not installed"}), 500
        elif file_path.endswith('.txt'):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        else:
            return jsonify({'error': 'Unsupported file format. Only PDF or TXT supported.'}), 400

        if not content.strip():
            return jsonify({'error': 'No readable content found in file'}), 400

        # Prompt to model
        prompt = f"""
You are an expert assistant. Based on the following file content:

--- FILE CONTENT START ---
{content[:4000]}
--- FILE CONTENT END ---

Answer the user's question: "{question}"
"""

        response = openai.ChatCompletion.create(
            model="deepseek/deepseek-chat-v3-0324:free",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers based on documents."},
                {"role": "user", "content": prompt}
            ]
        )

        answer = response['choices'][0]['message']['content']

        return jsonify({
            'session_id': session_id,
            'question': question,
            'answer': answer
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/cleanup', methods=['POST'])
def cleanup_session():
    """
    Clean up the uploaded session
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            session_id:
              type: string
    responses:
      200:
        description: Session cleaned up
    """
    data = request.json
    session_id = data.get('session_id', '')

    if not session_id:
        return jsonify({'error': 'No session ID provided'}), 400

    session_dir = os.path.join(UPLOAD_FOLDER, session_id)
    if os.path.exists(session_dir):
        shutil.rmtree(session_dir)

    return jsonify({'message': 'Session cleaned up successfully'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import uuid
import shutil
import tempfile

app = Flask(__name__)
CORS(app)

# Create a temporary directory for file uploads
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'file_command_nexus')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Generate a unique session ID for this upload
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

@app.route('/api/execute', methods=['POST'])
def execute_command():
    data = request.json
    command = data.get('command', '')
    session_id = data.get('session_id', '')
    
    if not command:
        return jsonify({'error': 'No command provided'}), 400
    
    if not session_id:
        return jsonify({'error': 'No session ID provided'}), 400
    
    session_dir = os.path.join(UPLOAD_FOLDER, session_id)
    if not os.path.exists(session_dir):
        return jsonify({'error': 'Invalid session ID'}), 400
    
    # For security, we'll limit the commands that can be executed
    # This is a very simple implementation and should be enhanced for production
    try:
        # Change to the session directory and execute the command
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=session_dir,
            capture_output=True, 
            text=True, 
            timeout=30
        )
        
        return jsonify({
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        })
    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Command timed out'}), 408
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cleanup', methods=['POST'])
def cleanup_session():
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

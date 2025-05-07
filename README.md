
# File Command Nexus

A full-stack application that allows you to upload files and execute commands on them using a React frontend and Python Flask backend.

## Features

- File upload with drag-and-drop support
- Command execution on uploaded files
- Real-time display of command results
- Simple and intuitive interface

## Project Structure

```
├── backend/            # Python Flask backend
│   ├── app.py          # Main Flask application
│   └── requirements.txt # Python dependencies
├── src/                # React frontend
│   ├── components/     # React components
│   └── pages/          # Application pages
└── ...                 # Other React project files
```

## Running the Application

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```
   python app.py
   ```

4. For swagger api docs generation:
   ```
    http://localhost:5000/apidocs/
   ```

The backend server will start on http://localhost:5000.

### Frontend Setup

1. From the project root, install dependencies:
   ```
   npm install
   ```

2. Start the React development server:
   ```
   npm run dev
   ```

The frontend application will be available at http://localhost:8080.

## Usage

1. Upload a file using the file upload area
2. Enter commands in the command input area
3. Click "Run Command" to execute the command on the uploaded file
4. View the results in the command results area

## Security Considerations

This application is intended for demonstration purposes and should not be used in production without implementing proper security measures, including:

- Input validation and sanitization
- Authentication and authorization
- Rate limiting
- Secure file handlings
- Command restrictions

## License

MIT

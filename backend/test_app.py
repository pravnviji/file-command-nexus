import requests
import time

# File to upload
pdf_path = r'<your path file>'
upload_url = 'http://127.0.0.1:5000/api/upload'
ask_url = 'http://127.0.0.1:5000/api/ask'
cleanup_url = 'http://127.0.0.1:5000/api/cleanup'


def test_end_to_end():
    # Step 1: Upload the file
    print("Uploading file...")
    with open(pdf_path, 'rb') as f:
        files = {'file': f}
        upload_response = requests.post(upload_url, files=files)
    assert upload_response.status_code == 200, "Upload failed"
    upload_data = upload_response.json()
    print("Upload Response:", upload_data)

    session_id = upload_data['session_id']
    assert session_id, "Session ID missing"

    # Step 2: Ask a question
    question = "What is prompt engineering and why is it important?"
    ask_payload = {
        'session_id': session_id,
        'question': question
    }

    print("Asking question...")
    ask_response = requests.post(ask_url, json=ask_payload)
    print("Status Code:", ask_response.status_code)
    print("Response Text:", ask_response.text)
    assert ask_response.status_code == 200, "Question request failed"
    ask_data = ask_response.json()
    print("Question Response:", ask_data)

    assert 'answer' in ask_data, "No answer in response"

    # Step 3: Cleanup
    cleanup_payload = {'session_id': session_id}
    print("Cleaning up session...")
    cleanup_response = requests.post(cleanup_url, json=cleanup_payload)
    assert cleanup_response.status_code == 200, "Cleanup failed"
    print("Cleanup Response:", cleanup_response.json())

    print("\n✅ E2E test completed successfully.")


if __name__ == '__main__':
    test_end_to_end()

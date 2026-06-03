from flask import Flask, request, jsonify
from flask_cors import CORS
from google_sheets import append_lead

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app)

@app.route('/submit-lead', methods=['POST'])
def submit_lead():
    try:
        # Parse incoming JSON data
        data = request.json
        
        # We expect FullName, WhatsApp, Portfolio, InvestorDNA, Message
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Call the function from google_sheets.py to append the data
        append_lead(data)
        
        return jsonify({"status": "success"}), 200
        
    except Exception as e:
        print(f"Error processing lead: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(host='127.0.0.1', port=5000)

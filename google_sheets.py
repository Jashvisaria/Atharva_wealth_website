import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import pytz

def append_lead(data):
    """
    Appends a lead to the 'Atharva_Leads' Google Sheet in the 'Leads' worksheet.
    
    Args:
        data (dict): A dictionary containing 'FullName', 'WhatsApp', 'Portfolio', 
                     'InvestorDNA', and 'Message'.
    """
    # Define the scope
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive"
    ]

    try:
        # Add credentials to the account
        creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)
        
        # Authorize the client
        client = gspread.authorize(creds)
        
        # Get the instance of the Spreadsheet
        sheet = client.open_by_key('1Mgtn0vwlN8l5yeYtjLAMIW43fA5lBXyub7Y7MBouKY4')
        
        # Get the specific worksheet
        worksheet = sheet.worksheet('Sheet1')
        
        # Get current timestamp in IST
        ist_timezone = pytz.timezone('Asia/Kolkata')
        ist_now = datetime.now(ist_timezone)
        timestamp = ist_now.strftime('%Y-%m-%d %H:%M:%S')
        
        # Prepare the row data
        row = [
            timestamp,
            data.get('FullName', ''),
            data.get('WhatsApp', ''),
            data.get('Portfolio', ''),
            data.get('InvestorDNA', ''),
            data.get('Message', ''),
            'New Lead'
        ]
        
        # Append the row
        worksheet.append_row(row)
        print("Successfully appended lead to Google Sheets.")
        
    except gspread.exceptions.SpreadsheetNotFound:
        print("Error: The Google Sheet 'Atharva_Leads' was not found.")
        print("Please ensure that you have shared the Google Sheet with the client_email address found in your credentials.json file.")
    except gspread.exceptions.WorksheetNotFound:
        print("Error: The worksheet 'Leads' was not found in 'Atharva_Leads'.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Example usage:
    sample_data = {
        'FullName': 'John Doe',
        'WhatsApp': '+919876543210',
        'Portfolio': '50L - 1Cr',
        'InvestorDNA': 'Aggressive',
        'Message': 'Interested in PMS services.'
    }
    append_lead(sample_data)

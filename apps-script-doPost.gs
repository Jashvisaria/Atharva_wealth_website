// =====================================================
// Atharva Wealth - Google Apps Script
// For deployment at: script.google.com
// =====================================================
//
// INSTRUCTIONS:
// 1. Open script.google.com and open your existing project
// 2. Replace ALL existing code in Code.gs with the code below
// 3. Replace "YOUR_ACTUAL_SHEET_ID_HERE" with your actual Google Sheet ID
//    (the long string between /d/ and /edit in your Sheet URL)
// 4. Save (Ctrl+S)
// 5. Deploy → Manage Deployments → Edit (pencil icon) →
//    Version: "New version" → Deploy
// 6. Copy the new Web App URL and update APPS_SCRIPT_URL in contact.html
//
// =====================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp
      .openById("YOUR_ACTUAL_SHEET_ID_HERE")
      .getActiveSheet();

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp,
      data.name,
      data.whatsapp,
      data.portfolio,
      data.message,
      data.source
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

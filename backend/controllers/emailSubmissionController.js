const googleSheetsService = require('../services/googleSheetsService'); // Adjust the path to your service file

exports.submitEmailData = async (req, res) => {
  try {
    const emailData = req.body.emailData; // Array of email submission objects from the frontend
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Google Sheet ID from environment variables
    const range = 'Sheet11!A2:E'; // Adjust the range as necessary for your email sheet
    

    // Check if emailData is empty or undefined
    if (!emailData || emailData.length === 0) {
      return res.status(400).send('No email data provided.');
    }

    // Validate the structure of emailData to ensure it contains the required fields
    emailData.forEach((entry, index) => {
      if (!entry.classroomName || !entry.classroomId || !entry.studentName || !entry.studentId || !entry.email) {
        console.error(`Invalid data at index ${index}:`, entry);
        return res.status(400).send(`Invalid data at index ${index}. All fields are required.`);
      }
    });

    // Call the Google Sheets service to append or update email data
    await googleSheetsService.appendOrUpdateEmailData(emailData, spreadsheetId, range);

    res.status(200).send('Email data submitted successfully');
  } catch (error) {
    console.error('Error submitting email data:', error);
    res.status(500).send('Error submitting email data');
  }
};

const googleSheetsService = require('../services/googleSheetsService'); // Path to your service file

exports.submitGoogleMeetData = async (req, res) => {
  try {
    const formData = req.body; // Extract form data from the request body
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Ensure this environment variable is set
    const range = 'Sheet10!A2:E'; // The range in Sheet10 where data starts from A2

    // Call the Google Sheets service to append or update Google Meet data
    await googleSheetsService.appendOrUpdateGoogleMeetData(formData, spreadsheetId, range);

    res.status(200).send('Google Meet data submitted successfully');
  } catch (error) {
    console.error('Error submitting Google Meet data:', error);
    res.status(500).send('Error submitting Google Meet data');
  }
};

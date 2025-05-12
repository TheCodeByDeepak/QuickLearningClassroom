const googleSheetsService = require('../services/googleSheetsService'); // Path to your service file

exports.submitFormData = async (req, res) => {
  try {
    const formData = req.body; // Extract form data from the request body
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Make sure this environment variable is set
    const range = 'Sheet9!A2:F'; // The range in Sheet9 where data starts from A2

    // Call the Google Sheets service to append or update form data
    await googleSheetsService.appendOrUpdateFormData(formData, spreadsheetId, range);

    res.status(200).send('Form data submitted successfully');
  } catch (error) {
    console.error('Error submitting form data:', error);
    res.status(500).send('Error submitting form data');
  }
};

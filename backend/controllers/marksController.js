const googleSheetsService = require('../services/googleSheetsService');

exports.submitMarks = async (req, res) => {
  try {
    const marksData = req.body; // This will contain the formatted marks data
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
    const range = 'Sheet5!A2:J'; // Adjust the range as necessary for your marks sheet

    // Call the Google Sheets service to append or update marks data
    await googleSheetsService.appendOrUpdateMarksData(marksData, spreadsheetId, range);

    res.status(200).send('Marks submitted successfully');
  } catch (error) {
    console.error('Error submitting marks:', error);
    res.status(500).send('Error submitting marks');
  }
};

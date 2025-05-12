const googleSheetsService = require('../services/googleSheetsService');

exports.submitHomework = async (req, res) => {
  try {
    const homeworkData = req.body; // This will contain the formatted homework data
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
    const range = 'Sheet8!A2:I'; // Adjust the range as necessary for your homework sheet

    // Call the Google Sheets service to append or update homework data
    await googleSheetsService.appendOrUpdateHomeworkData(homeworkData, spreadsheetId, range);

    res.status(200).send('Homework submitted successfully');
  } catch (error) {
    console.error('Error submitting homework:', error);
    res.status(500).send('Error submitting homework');
  }
};

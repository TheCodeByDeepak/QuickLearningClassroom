const googleSheetsService = require('../services/googleSheetsService');

exports.submitBlacklistData = async (req, res) => {
  try {
    const blacklistData = req.body; // Assuming blacklistData includes classroomName, classroomId, studentName, studentId, blacklist details

    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
    const range = 'Sheet4!A2:F'; // Adjust the range to start from row 2 in Sheet4

    // Call the Google Sheets service to append blacklist data
    await googleSheetsService.appendOrUpdateBlacklistData(blacklistData, spreadsheetId, range);

    res.status(200).send('Blacklist data submitted successfully');
  } catch (error) {
    console.error('Error submitting blacklist data:', error);
    res.status(500).send('Error submitting blacklist data');
  }
};

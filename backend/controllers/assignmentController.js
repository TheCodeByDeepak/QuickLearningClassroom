const googleSheetsService = require('../services/googleSheetsService');

exports.submitAssignment = async (req, res) => {
  try {
    const assignmentData = req.body; // This will contain the formatted assignment data
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID

    // Call the Google Sheets service to append or update assignment data
    await googleSheetsService.appendOrUpdateAssignmentData(assignmentData, spreadsheetId);

    res.status(200).send('Assignment submitted successfully');
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).send('Error submitting assignment');
  }
};

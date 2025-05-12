const googleSheetsService = require('../services/googleSheetsService');

exports.submitFeeData = async (req, res) => {
  try {
    const feeData = req.body; // Assuming feeData includes classroomName, classroomId, studentName, studentId, fee details

    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
    const range = 'Sheet3!A2:F'; // Adjust the range to start from row 2 in Sheet3

    // Call the Google Sheets service to append fee data
    await googleSheetsService.appendOrUpdateFeeData(feeData, spreadsheetId, range);

    res.status(200).send('Fee data submitted successfully');
  } catch (error) {
    console.error('Error submitting fee data:', error);
    res.status(500).send('Error submitting fee data');
  }
};

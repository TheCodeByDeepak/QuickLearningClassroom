const googleSheetsService = require('../services/googleSheetsService');

exports.updateScheduleData = async (req, res) => {
  try {
    const scheduleData = req.body; // This will contain the formatted schedule data
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
    const range = 'Sheet7!A2:E'; // Adjust the range as necessary for your schedules sheet

    // Call the Google Sheets service to append or update schedule data
    await googleSheetsService.appendOrUpdateScheduleData(scheduleData, spreadsheetId, range);

    res.status(200).send('Schedule data submitted successfully');
  } catch (error) {
    console.error('Error submitting schedule data:', error);
    res.status(500).send('Error submitting schedule data');
  }
};

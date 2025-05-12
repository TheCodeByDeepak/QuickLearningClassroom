const googleSheetsService = require('../services/googleSheetsService');

exports.submitVideoData = async (req, res) => {
  try {
    const videoData = req.body; // This will contain the formatted video data
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
    const range = 'Sheet6!A2:F'; // Adjust the range as necessary for your videos sheet

    // Call the Google Sheets service to append or update video data
    await googleSheetsService.appendOrUpdateVideoData(videoData, spreadsheetId, range);

    res.status(200).send('Video data submitted successfully');
  } catch (error) {
    console.error('Error submitting video data:', error);
    res.status(500).send('Error submitting video data');
  }
};

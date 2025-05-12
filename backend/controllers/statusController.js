const googleSheetsService = require('../services/googleSheetsService'); // Importing the service

exports.submitAssignment = async (req, res) => {
  try {
    // Destructuring the data from the request body
    const { classroomId, studentId, startDate, endDate, remark, status } = req.body;

    // Create the assignmentData object with the necessary fields
    const assignmentData = [{
      classroomId,
      studentId,
      startDate,
      endDate,
      remark,
      status
    }];

    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Your Google Sheet ID (environment variable)

    // Call the Google Sheets service function to append or update assignment data
    await googleSheetsService.appendOrUpdateAssignmentStatus(assignmentData, spreadsheetId);

    // Respond with a success message
    res.status(200).send('Assignment status submitted successfully');
  } catch (error) {
    // Handle errors and send an error message
    console.error('Error submitting assignment status:', error);
    res.status(500).send('Error submitting assignment status');
  }
};

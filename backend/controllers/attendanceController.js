const googleSheetsService = require('../services/googleSheetsService');

exports.submitAttendance = async (req, res) => {
    try {
      const attendanceData = req.body; // This will be your formattedData
      const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
      const range = 'Sheet1!A2:G'; // Adjust the range as necessary for your sheet
  
      // Call the Google Sheets service to append attendance data
      await googleSheetsService.appendOrUpdateAttendanceData(attendanceData, spreadsheetId, range);
      
      res.status(200).send('Attendance submitted successfully');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      res.status(500).send('Error submitting attendance');
    }
  };



exports.submitExpense = async (req, res) => {
  try {
    const {invoiceno, date, method, payedto, category, description, amount, additionalnote } = req.body;
    const expenseData = [
      [invoiceno, date, method, payedto, category, description, amount, additionalnote],
    ]; // Structure as rows

    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
    const range = 'Sheet2!A2:H'; // Use Sheet2 for expenses

    // Append expense data to Google Sheet
    await googleSheetsService.appendData(expenseData, spreadsheetId, range);

    res.status(200).send('Expense submitted successfully');
  } catch (error) {
    console.error('Error submitting expense:', error);
    res.status(500).send('Error submitting expense');
  }
};

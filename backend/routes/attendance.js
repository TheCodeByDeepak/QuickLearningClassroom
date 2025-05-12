const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

router.get("/fetchAttendanceData", async (req, res) => {
  const classroomId = req.query.classroomId; // Get classroomId from query parameters
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1:G1001", // Adjust as needed
    });

    // Filter attendance data based on classroom ID (assuming classroom ID is in the second column)
    const rows = response.data.values;
    const filteredData = rows
      .filter(row => row[1] === classroomId) // B column is index 1
      .map(row => [row[2], row[4], row[5], row[6], row[1], row[3]]); // Extract C, E, F, G columns (indexes 2, 4, 5, 6)

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No attendance records found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered data
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching attendance data" });
  }
});

// New endpoint to fetch attendance based on studentId and classroomId
router.get("/fetchAttendanceByStudent", async (req, res) => {
  const { classroomId, studentId } = req.query; // Get classroomId and studentId from query parameters
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1:G1001", // Adjust as needed
    });

    const rows = response.data.values;
    // Filter attendance data based on classroom ID and student ID
    const filteredData = rows.filter(row => row[1] === classroomId && row[3] === studentId); // Assuming student ID is in the D column (index 3)

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No attendance records found for this student in the specified classroom ID" });
    }

    // Extracting relevant columns (assuming they are the same as before)
    const attendanceRecords = filteredData.map(row => [row[2],row[4], row[5], row[6], row[1], row[3]]); // Extract E, F, G columns (indexes 4, 5, 6)

    res.json(attendanceRecords); // Respond with filtered data
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching attendance data" });
  }
});

router.delete("/deleteAttendance", async (req, res) => {

  const { classroomId, studentId, date } = req.body; // Extract the required details from the request body


  // Initialize Google Sheets API client
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  try {
    // Get authenticated client
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Fetch existing data to locate the row to delete
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1:G1001", // Adjust range to include columns A to G
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId && // Classroom ID matches (Column A)
        row[3] === studentId &&   // Student ID matches (Column B)
        row[4] === date           // Date matches (Column C)
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching attendance record found" });
    }

    console.log(`Attendance Data deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet1!A${rowIndex + 1}:G${rowIndex + 1}`, // Adjust range to clear all relevant columns (A to G)
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", "", ""]], // Clear the content of the row
      },
    });

    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    res.status(500).json({ error: "Error deleting attendance record" });
  }
});

module.exports = router;

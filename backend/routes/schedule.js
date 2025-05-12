const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Endpoint to fetch schedule data based on classroomId
router.get("/getScheduleByClassroomId", async (req, res) => {
  const classroomId = req.query.classroomId; // Get classroomId from query parameters
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Fetch data from Sheet7 (adjust the range as needed)
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet7!A1:E1001", // Adjust range to match your sheet data
    });

    // Extract rows and filter based on classroomId
    const rows = response.data.values;
    const filteredData = rows
      .filter(row => row[1] === classroomId) // Assuming classroomId is in the first column (A column)
      .map(row => ({
        date: row[2],         // Column B: Date
        subject: row[3],      // Column C: Subject
        notes: row[4],  // Column D: Additional Note
      }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No schedule found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered schedule data
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    res.status(500).json({ error: "Error fetching schedule data" });
  }
});

router.delete("/deleteSchedule", async (req, res) => {
  const { classroomId, date, subject } = req.body; // Extract the required details from the request body

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
      range: "Sheet7!A1:E1001", // Adjust range to include columns A to E (classroomId, date, subject, etc.)
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId &&  // Classroom ID matches (Column A)
        row[2] === date &&          // Date matches (Column B)
        row[3] === subject          // Subject matches (Column C)
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching schedule data found" });
    }

    // Log the found row index for debugging
    console.log(`Schedule data deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet7!A${rowIndex + 1}:E${rowIndex + 1}`, // Adjust range to include all relevant columns (A to E)
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", ""]], // Clear the content of the row
      },
    });

    res.json({ message: "Schedule data deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule data:", error);
    res.status(500).json({ error: "Error deleting schedule data" });
  }
});



module.exports = router;

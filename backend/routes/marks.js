const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Endpoint to fetch test marks data based on classroomId
router.get("/fetchTestMarks", async (req, res) => {
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
      range: "Sheet5!A1:K1001", // Adjust as needed
    });

    // Filter test marks data based on classroom ID (assuming classroom ID is in the second column)
    const rows = response.data.values;
    const filteredData = rows
      .filter(row => row[1] === classroomId) // B column is index 1
      .map(row => [row[2], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[3]]); // Extract necessary columns (adjust as needed)

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No test marks records found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered data
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching test marks data" });
  }
});

// Endpoint to fetch test marks based on studentId and classroomId
router.get("/fetchTestMarksByStudent", async (req, res) => {
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
      range: "Sheet5!A1:K1001", // Adjust as needed
    });

    const rows = response.data.values;
    // Filter test marks data based on classroom ID and student ID
    const filteredData = rows.filter(row => row[1] === classroomId && row[3] === studentId); // Assuming student ID is in the D column (index 3)
  

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No test marks records found for this student in the specified classroom ID" });
    }

    // Extracting relevant columns (assuming they are the same as before)
    const testMarksRecords = filteredData.map(row => [row[2], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[3]]); // Adjust columns as needed

    res.json(testMarksRecords); // Respond with filtered data
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching test marks data" });
  }
});

router.delete("/deleteTestMarks", async (req, res) => {

  const { classroomId, studentId, date, subject } = req.body; // Extract required details from the request body

  // Initialize Google Sheets API client
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH, // Path to your service account key file
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Scopes required for Sheets API
  });

  try {
    // Get authenticated client
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Fetch existing data to locate the row to delete
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID, // Your Google Sheet ID
      range: "Sheet5!A1:K1001", // Range for columns A to K
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId &&  // Column B: Classroom ID matches
        row[3] === studentId &&    // Column D: Student ID matches
        row[4] === date &&         // Column E: Date matches
        row[6] === subject         // Column G: Subject matches
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching test marks data found" });
    }

    // Log the found row index for debugging
    console.log(`Test marks data deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet5!A${rowIndex + 1}:K${rowIndex + 1}`, // Specify the row to clear
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", "", "", "", "", "", ""]], // Clear all columns (A to K)
      },
    });

    res.json({ message: "Test marks data deleted successfully" });
  } catch (error) {
    console.error("Error deleting test marks data:", error);
    res.status(500).json({ error: "Error deleting test marks data" });
  }
});

module.exports = router;

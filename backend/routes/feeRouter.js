const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Fetch fee data for all students in a specific classroom
router.get("/fetchFeeData", async (req, res) => {
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
      range: "Sheet3!A1:J1001", // Adjust as needed
    });

    const rows = response.data.values;
    const filteredData = rows
      .filter((row) => row[2] === classroomId) // Classroom ID is in column C (index 2)
      .map((row) => [row[0],row[3],row[1],row[5], row[6], row[7], row[8], row[9], row[2], row[4]]); // Extract A, F, G, H, I, J columns

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No fee records found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered data
  } catch (error) {
    console.error("Error fetching fee data:", error);
    res.status(500).json({ error: "Error fetching fee data" });
  }
});

// Fetch fee data for a specific student in a specific classroom
router.get("/fetchFeeByStudent", async (req, res) => {
    const { classroomId, studentId } = req.query;
  
    // Check if the necessary query parameters are present
    if (!classroomId || !studentId) {
      return res.status(400).json({ message: "Missing classroomId or studentId in query parameters" });
    }
  
    const auth = new GoogleAuth({
      keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  
    try {
      // Authenticate and get Google Sheets client
      const client = await auth.getClient();
      const sheetsAPI = google.sheets({ version: "v4", auth: client });
  
      // Fetch data from Google Sheets
      const response = await sheetsAPI.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet3!A1:J1001", // Adjust range as needed
      });
  
      const rows = response.data.values;
  
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: "Google Sheet data is empty or unavailable" });
      }
  
      // Filter data for the given classroomId and studentId
      const filteredData = rows.filter(
        (row) => row[2] === classroomId && row[4] === studentId // Classroom ID in column C, Student ID in column E
      );
  
      // If no matching records are found
      if (filteredData.length === 0) {
        return res.status(404).json({ message: "No fee records found for this student in the specified classroom ID" });
      }
  
      // Map filtered data to the fee records format (columns A, F, G, H, I, J)
      const feeRecords = filteredData.map((row) => [row[0],row[3],row[1], row[5], row[6], row[7], row[8], row[9], row[2], row[4]]);
  
      // Return the fee records as the response
      res.json(feeRecords);
  
    } catch (error) {
      console.error("Error fetching fee data:", error);
      res.status(500).json({ error: "Error fetching fee data" });
    }
  });




  router.delete("/deleteFee", async (req, res) => {
    const { receiptNo, classroomId, studentId, date } = req.body; // Extract required details from the request body
  
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
        range: "Sheet3!A1:J1001", // Range for columns A to J (for Sheet3)
      });
  
      const rows = response.data.values;
  
      // Find the index of the row that matches the criteria
      const rowIndex = rows.findIndex(
        (row) =>
          row[0] === receiptNo &&        // Column A: Receipt No matches
          row[2] === classroomId &&      // Column B: Classroom ID matches
          row[4] === studentId &&        // Column C: Student ID matches
          row[5] === date                // Column D: Date matches
      );
  
      if (rowIndex === -1) {
        return res.status(404).json({ message: "No matching data found" });
      }
  
      // Log the found row index for debugging
      console.log(`Fee Data for receiptNo ${receiptNo} deleted successfully`);
  
      // Clear the matching row by updating it with empty values
      await sheetsAPI.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `Sheet3!A${rowIndex + 1}:J${rowIndex + 1}`, // Specify the row to clear (columns A to J)
        valueInputOption: "RAW",
        resource: {
          values: [["", "", "", "", "", "", "", "", "", ""]], // Clear all columns (A to J)
        },
      });
  
      res.json({ message: "Data deleted successfully" });
    } catch (error) {
      console.error("Error deleting data:", error);
      res.status(500).json({ error: "Error deleting data" });
    }
  });

  
module.exports = router;

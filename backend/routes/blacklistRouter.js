const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Fetch blacklist data for a specific classroom
router.get("/fetchBlacklistByClassroom", async (req, res) => {
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
      range: "Sheet4!A1:G1000", // Adjust as needed
    });

    const rows = response.data.values;

    // Filter data for the specified classroomId (Column C)
    const filteredData = rows.filter((row) => row[1] === classroomId).map((row) => ({
      name: row[2], // Column C
      studentId: row[3],
      classroomId: row[1],
      date: row[4], // Column E
      reason: row[5], // Column F
      additionalNote: row[6], // Column G
    }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No blacklist records found for this classroom ID" });
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching blacklist data:", error);
    res.status(500).json({ error: "Error fetching blacklist data" });
  }
});

// Fetch blacklist data for a specific student in a classroom

router.get("/fetchBlacklistByStudent", async (req, res) => {
  const { classroomId, studentId } = req.query;

  if (!classroomId || !studentId) {
    return res.status(400).json({ message: "Missing classroomId or studentId in query parameters" });
  }

  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet4!A1:G1000", // Adjust as needed
    });

    const rows = response.data.values;

    // Filter data for the specified classroomId and studentId
    const filteredData = rows
      .filter((row) => row[1] === classroomId && row[3] === studentId) // Column C for classroomId, Column E for studentId
      .map((row) => ({
        name: row[2], // Column C
        studentId: row[3],
        classroomId: row[1],
        date: row[4], // Column E
        reason: row[5], // Column F
        additionalNote: row[6], // Column G
      }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No blacklist records found for this student in the specified classroom" });
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching blacklist data:", error);
    res.status(500).json({ error: "Error fetching blacklist data" });
  }
});


router.delete("/deleteStudentData", async (req, res) => {
  
  const { classroomId, studentId, date } = req.body; // Extract required details from the request body

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
      range: "Sheet4!A1:G1001", // Range for columns A to G
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId &&  // Column B: Classroom ID matches
        row[3] === studentId &&    // Column C: Student ID matches
        row[4] === date       // Column D: Date matches

    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching data found" });
    }

    // Log the found row index for debugging
    console.log(`Blacklist Data deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet4!A${rowIndex + 1}:G${rowIndex + 1}`, // Specify the row to clear
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", "", ""]], // Clear all columns (A to G)
      },
    });

    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Error deleting data" });
  }
});


module.exports = router;

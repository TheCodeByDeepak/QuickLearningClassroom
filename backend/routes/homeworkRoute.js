const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Endpoint to fetch homework data based on classroomId
router.get("/fetchHomeworkData", async (req, res) => {
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
      range: "Sheet8!A1:K1001", // Adjust the range as needed, targeting Sheet8
    });

    // Filter homework data based on classroom ID (assuming classroom ID is in the second column)
    const rows = response.data.values;
    const filteredData = rows
      .filter(row => row[1] === classroomId) // B column is index 1
      .map(row => ({
        classroomName: row[0], // Classroom name (from column A)
        studentName: row[2],    // Student name (from column C)
        studentId: row[3],
        startDate: row[4],      // Start date (from column E)
        startTime: row[5],      // Start time (from column F)
        endDate: row[6],        // End date (from column G)
        endTime: row[7],        // End time (from column H)
        description: row[8],    // Description (from column I)
        remark: row[9],         // Remark (from column J)
        status: row[10]          // Status (from column K)
      }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No homework records found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered data
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching homework data" });
  }
});




// Endpoint to fetch homework data based on classroomId and studentId
router.get("/fetchHomeworkByStudent", async (req, res) => {
    const { classroomId, studentId } = req.query; // Correctly destructure classroomId and studentId from req.query

    const auth = new GoogleAuth({
      keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  
    try {
      const client = await auth.getClient();
      const sheetsAPI = google.sheets({ version: "v4", auth: client });
      const response = await sheetsAPI.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet8!A1:K1001", // Adjust the range as needed, targeting Sheet8
      });
  
      // Filter homework data based on classroom ID (assuming classroom ID is in the second column)
      const rows = response.data.values;
      const filteredData = rows
        .filter(row => row[1] === classroomId && row[3] === studentId) // B column is index 1
        .map(row => ({
          classroomName: row[0], // Classroom name (from column A)
          studentName: row[2],    // Student name (from column C)
          studentId: row[3],
          startDate: row[4],      // Start date (from column E)
          startTime: row[5],      // Start time (from column F)
          endDate: row[6],        // End date (from column G)
          endTime: row[7],        // End time (from column H)
          description: row[8],    // Description (from column I)
          remark: row[9],         // Remark (from column J)
          status: row[10]          // Status (from column K)
        }));
  
      if (filteredData.length === 0) {
        return res.status(404).json({ message: "No homework records found for this classroom ID and student ID" });
      }
  
      res.json(filteredData); // Respond with filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Error fetching homework data" });
    }
});


router.get("/uploadHomeworkByStudent", async (req, res) => {
  const { classroomId, studentId } = req.query; // Correctly destructure classroomId and studentId from req.query

  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet8!A1:J1001", // Adjust the range as needed, targeting Sheet8
    });

    // Filter homework data based on classroom ID (assuming classroom ID is in the second column)
    const rows = response.data.values;
    const filteredData = rows
      .filter(row => row[1] === classroomId && row[3] === studentId) // B column is index 1
      .map(row => ({
        classroomName: row[0], // Classroom name (from column A)
        studentName: row[2],    // Student name (from column C)
        studentId: row[3],
        startDate: row[4],      // Start date (from column E)
        startTime: row[5],      // Start time (from column F)
        endDate: row[6],        // End date (from column G)
        endTime: row[7],        // End time (from column H)
        description: row[8],    // Description (from column I)
        remark: row[9],         // Remark (from column J)
        status: row[10]          // Status (from column K)
      }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No homework records found for this classroom ID and student ID" });
    }

    res.json(filteredData); // Respond with filtered data
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching homework data" });
  }
});



router.delete("/deleteHomework", async (req, res) => {
  const { classroomId, studentId, startDate, endDate } = req.body; // Extract the required details from the request body

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
      range: "Sheet8!A1:K1001", // Adjust range to include columns A to K
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId &&  // Classroom ID matches
        row[3] === studentId &&    // Student ID matches
        row[4] === startDate &&    // Date matches
        row[6] === endDate         // Description matches
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching homework data found" });
    }

    // Log the found row index for debugging
    console.log(`Homework data deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet8!A${rowIndex + 1}:K${rowIndex + 1}`, // Adjust range to include all columns (A to K)
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", "", "", "", "", "", ""]], // Clear all columns from A to K
      },
    });

    res.json({ message: "Homework data deleted successfully" });
  } catch (error) {
    console.error("Error deleting homework data:", error);
    res.status(500).json({ error: "Error deleting homework data" });
  }
});




module.exports = router;


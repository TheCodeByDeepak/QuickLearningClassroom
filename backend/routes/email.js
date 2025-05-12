const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Endpoint to fetch email data based on classroomId
router.get("/fetchEmailsByClassroom", async (req, res) => {
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
      range: "Sheet11!A1:F1000", // Adjust the range based on your sheet structure
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No email data found in Sheet11" });
    }

    // Filter email data based on classroom ID (assuming classroom ID is in the first column)
    const filteredData = rows
      .filter((row) => row[1] === classroomId) // A column (index 0) is classroom ID
      .map((row) => ({
        name: row[2], // Assuming Name is in the second column (B)
        date: row[4], // Assuming Date is in the third column (C)
        email: row[5], // Assuming Email is in the fourth column (D)
        classroomId: row[1], 
        studentId: row[3]
      }));

    if (filteredData.length === 0) {
      return res
        .status(404)
        .json({ message: "No emails found for this classroom ID" });
    }

    res.json(filteredData); // Respond with the filtered data
  } catch (error) {
    console.error("Error fetching email data:", error);
    res.status(500).json({ error: "Error fetching email data" });
  }
});


router.get("/fetchEmailsByStudent", async (req, res) => {
  const { classroomId, studentId } = req.query; // Get classroomId and studentId from query parameters

  // Google Sheets Authentication
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Get data from the Google Sheet
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet11!A1:F1000", // Adjust the range based on your sheet structure
    });

    const rows = response.data.values;

    // Check if rows are present
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No email data found in Sheet11" });
    }

    // Filter data based on classroomId and studentId
    const filteredData = rows
      .filter((row) => row[1] === classroomId && row[3] === studentId) // classroomId is in index 1, studentId in index 0
      .map((row) => ({
        name: row[2], // Assuming Name is in the third column (C)
        date: row[4], // Assuming Date is in the fifth column (E)
        email: row[5], // Assuming Email is in the sixth column (F)
        classroomId: row[1], 
        studentId: row[3]
      }));

    // If no data is found for the specified classroomId and studentId
    if (filteredData.length === 0) {
      return res
        .status(404)
        .json({ message: "No emails found for this classroom ID and student ID" });
    }

    // Return the filtered data
    res.json(filteredData);

  } catch (error) {
    console.error("Error fetching email data:", error);
    res.status(500).json({ error: "Error fetching email data" });
  }
});


router.delete("/deleteEmail", async (req, res) => {
  const { classroomId, studentId, emailId } = req.body; // Extract required details

  // Initialize Google Sheets API client
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  try {
    // Get authenticated client
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Fetch existing data from Sheet11
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet11!A1:F1001", // Adjust range to include columns A to F
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId && // Classroom ID matches (Column A)
        row[3] === studentId &&    // Student ID matches (Column B)
        row[5] === emailId         // Email ID matches (Column C)
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching email record found" });
    }

    console.log(`Email Data deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet11!A${rowIndex + 1}:F${rowIndex + 1}`, // Adjust range to clear all relevant columns (A to F)
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", ""]], // Clear the content of the row
      },
    });

    res.json({ message: "Email record deleted successfully" });
  } catch (error) {
    console.error("Error deleting email record:", error);
    res.status(500).json({ error: "Error deleting email record" });
  }
});


// Export the router
module.exports = router;

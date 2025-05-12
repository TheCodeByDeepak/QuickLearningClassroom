const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Endpoint to fetch Google Meet links data based on classroomId
router.get("/getGoogleMeetLinks", async (req, res) => {
  const classroomId = req.query.classroomId; // Get classroomId from query parameters
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Fetch data from Sheet10 (adjust the range as needed)
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet10!A1:E1001", // Adjust range to match your sheet data
    });

    // Extract rows and filter based on classroomId
    const rows = response.data.values;
    const filteredData = rows
      .filter((row) => row[1] === classroomId) // Assuming classroomId is in the first column (A column)
      .map((row, index) => ({
        id: index + 1,       // Row ID (1-based index for Google Sheets)
        date: row[2],        // Column B: Date
        note: row[3],        // Column C: Note
        liveLink: row[4],    // Column D: Live Link
      }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No Google Meet links found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered Google Meet links data
  } catch (error) {
    console.error("Error fetching Google Meet links data:", error);
    res.status(500).json({ error: "Error fetching Google Meet links data" });
  }
});

// Endpoint to delete a Google Meet link based on date and live link
router.delete("/deleteGoogleMeetLink", async (req, res) => {
  const { classroomId, date, liveLink } = req.body;

  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Fetch existing data to locate the row to delete
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet10!A1:E1001",
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId && // Classroom ID matches
        row[2] === date && // Date matches
        row[4] === liveLink // Live link matches
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching Google Meet link found" });
    }

    // Clear the matching row
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet10!A${rowIndex + 1}:E${rowIndex + 1}`, // Google Sheets is 1-based index
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", ""]], // Clear the row values
      },
    });

    res.json({ message: "Google Meet link deleted successfully" });
  } catch (error) {
    console.error("Error deleting Google Meet link:", error);
    res.status(500).json({ error: "Error deleting Google Meet link" });
  }
});

module.exports = router;

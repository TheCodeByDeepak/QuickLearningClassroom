const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Endpoint to fetch video links data based on classroomId
router.get("/getVideosByClassroomId", async (req, res) => {
  const classroomId = req.query.classroomId; // Get classroomId from query parameters
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });
    
    // Fetch data from Sheet6 (adjust the range as needed)
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet6!A1:F1001", // Adjust range to match your sheet data
    });

    // Extract rows and filter based on classroomId
    const rows = response.data.values;
    const filteredData = rows
      .filter(row => row[1] === classroomId) // Assuming classroomId is in the first column (A column)
      .map(row => ({
        date: row[2],         // Column B: Date
        subject: row[3],      // Column C: Subject
        description: row[4],  // Column D: Description
        videoLink: row[5],    // Column E: Video Link
      }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No video links found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered video links data
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching video links data" });
  }
});

router.delete("/deleteVideo", async (req, res) => {
  const { classroomId, date, subject, videoLink } = req.body; // Extract the required details from the request body

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
      range: "Sheet6!A1:F1001", // Adjust range to include columns A to F (classroomId, date, subject, videoLink, etc.)
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId &&  // Classroom ID matches (Column A)
        row[2] === date &&          // Date matches (Column B)
        row[3] === subject &&       // Subject matches (Column C)
        row[5] === videoLink        // Video Link matches (Column D)
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching video data found" });
    }

    // Log the found row index for debugging
    console.log(`Video entry deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet6!A${rowIndex + 1}:F${rowIndex + 1}`, // Adjust range to include all relevant columns (A to F)
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", ""]], // Clear the content of the row (columns A to F)
      },
    });

    res.json({ message: "Video data deleted successfully" });
  } catch (error) {
    console.error("Error deleting video data:", error);
    res.status(500).json({ error: "Error deleting video data" });
  }
});

module.exports = router;

const express = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Endpoint to fetch form links data based on classroomId
router.get("/getFormLinksByClassroomId", async (req, res) => {
  const classroomId = req.query.classroomId; // Get classroomId from query parameters
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: "v4", auth: client });

    // Fetch data from Sheet9 (adjust the range as needed)
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet9!A1:F1001", // Adjust range to match your sheet data
    });

    // Extract rows and filter based on classroomId
    const rows = response.data.values;
    const filteredData = rows
      .filter(row => row[1] === classroomId) // Assuming classroomId is in the first column (A column)
      .map(row => ({
        date: row[2],         // Column B: Date
        topic: row[3],  
        description: row[4],      // Column C: Topic Description
        formLink: row[5],     // Column D: Form Link
      }));

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No form links found for this classroom ID" });
    }

    res.json(filteredData); // Respond with filtered form links data
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ error: "Error fetching form links data" });
  }
});

// Endpoint to delete a form link based on classroomId, date, and formLink
router.delete("/deleteForm", async (req, res) => {
  const { classroomId, date, formLink } = req.body; // Get the form details from the request body

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
      range: "Sheet9!A1:F1001", // Adjust range if necessary
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[1] === classroomId &&  // Classroom ID matches
        row[2] === date &&          // Date matches
        row[5] === formLink         // Form link matches
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching form link found" });
    }

    // Clear the matching row by updating the row with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet9!A${rowIndex + 1}:F${rowIndex + 1}`, // Google Sheets uses 1-based index
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", ""]], // Clear all columns in the row
      },
    });

    res.json({ message: "Form link deleted successfully" });
  } catch (error) {
    console.error("Error deleting form link:", error);
    res.status(500).json({ error: "Error deleting form link" });
  }
});

module.exports = router;

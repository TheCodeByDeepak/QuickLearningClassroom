const express = require('express');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const router = express.Router();

// Route to fetch expense data from Google Sheets
router.get('/fetchExpenseData', async (req, res) => {
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_KEY_PATH, // Path to your service account key
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    const client = await auth.getClient();
    const sheetsAPI = google.sheets({ version: 'v4', auth: client });

    // Fetch data from the expense sheet
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID, // Replace with the Google Sheet2 ID
      range: 'Sheet2!A1:H1001', // Adjust range as needed
    });

    const rows = response.data.values;
    

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No expense records found' });
    }

    // Filter out header row and blank rows
    const filteredData = rows
      .slice(1) // Remove header row
      .filter(row => row.some(cell => cell.trim() !== '')); // Remove rows with all empty cells

    if (filteredData.length === 0) {
      return res.status(404).json({ message: 'No valid expense records found' });
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching expense data:', error);
    res.status(500).json({ error: 'Error fetching expense data' });
  }
});


router.delete("/deleteExpense", async (req, res) => {
  const { invoiceNo, date, paymentMethod, payedTo, category } = req.body; // Extract required details from request body

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
      range: "Sheet2!A1:H1001", // Adjust range to include columns A to H (Invoice No, Date, Payment Method, etc.)
    });

    const rows = response.data.values;

    // Find the index of the row that matches the criteria
    const rowIndex = rows.findIndex(
      (row) =>
        row[0] === invoiceNo &&      // Invoice No matches (Column A)
        row[1] === date &&           // Date matches (Column B)
        row[2] === paymentMethod &&  // Payment Method matches (Column C)
        row[3] === payedTo &&        // Payed To matches (Column D)
        row[4] === category          // Category matches (Column E)
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "No matching expense data found" });
    }

    // Log the found row index for debugging
    console.log(`Expense entry deleted successfully`);

    // Clear the matching row by updating it with empty values
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet2!A${rowIndex + 1}:H${rowIndex + 1}`, // Adjust range to include all relevant columns (A to H)
      valueInputOption: "RAW",
      resource: {
        values: [["", "", "", "", "", "", "", ""]], // Clear the content of the row
      },
    });

    res.json({ message: "Expense data deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense data:", error);
    res.status(500).json({ error: "Error deleting expense data" });
  }
});

module.exports = router;

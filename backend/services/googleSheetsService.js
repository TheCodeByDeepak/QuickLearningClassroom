const { google } = require('googleapis');

// Setup Google Sheets API client
const sheets = google.sheets('v4');

// Your credentials and token
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SHEET_KEY_PATH, // Update this path
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

/**
 * Appends or updates attendance data in Google Sheets.
 * @param {Array} attendanceData - The attendance data to be logged in the sheet.
 * @param {string} spreadsheetId - The ID of the Google Sheet.
 * @param {string} range - The range in the Google Sheet where the data will be appended.
 * @returns {Promise<void>}
 */
const appendOrUpdateAttendanceData = async (attendanceData, spreadsheetId, range) => {
  try {
    const authClient = await auth.getClient();

    // Retrieve existing data to find matching rows
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map(row => [...row]); // clone to keep existing data unchanged

    // Check and update attendance data if it already exists in the sheet
    attendanceData.forEach(newEntry => {
      const matchIndex = updatedValues.findIndex(row =>
        row[1] === newEntry.classroomId && row[3] === newEntry.studentId && row[4] === newEntry.date // Assuming studentId and date are columns D and E
      );

      const rowValues = [
        newEntry.classroomName,
        newEntry.classroomId,
        newEntry.studentName,
        newEntry.studentId,
        newEntry.date,
        newEntry.status,
        newEntry.note,
      ];

      if (matchIndex !== -1) {
        // Update existing row
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
      }
    });

    // Write back updated values to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet1!A2', // Adjust start range as needed
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Attendance data processed successfully.');
  } catch (error) {
    console.error('Error processing attendance data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the controller
  }
};



const appendData = async (rawExpenseData, spreadsheetId, range) => {
  try {
    // Transform raw array data into structured objects
    const expenseData = rawExpenseData.map((item) => ({
      invoiceno: item[0],
      date: item[1],
      method: item[2],
      payedto:item[3],
      category:item[4],
      description: item[5],
      amount: item[6],
      additionalnote:item[7]
    }));

    const authClient = await auth.getClient();

    // Retrieve existing data
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet2', // Adjust the sheet name if needed
    });

    const rows = getResponse.data.values || [];
    const headerRow = rows[0] || ['Invoice No', 'Date', 'Payment Method', 'Payed To', 'Category', 'Description', 'Amount', 'Additional Note'];
    const dataRows = rows.slice(1);

    const updatedValues = dataRows.map((row) => [...row]); // Clone existing rows

    expenseData.forEach((newEntry) => {
      if (!newEntry.invoiceno || !newEntry.date || !newEntry.method || !newEntry.payedto || !newEntry.category || !newEntry.description || !newEntry.amount) {
        console.error('Invalid data entry:', newEntry);
        return; // Skip invalid entry
      }

      // Find if the Invoice Number already exists
      const matchIndex = updatedValues.findIndex((row) => row[0] === newEntry.invoiceno);

      const rowValues = [
        newEntry.invoiceno,
        newEntry.date,
        newEntry.method,
        newEntry.payedto,
        newEntry.category,
        newEntry.description,
        newEntry.amount,
        newEntry.additionalnote,
      ];

      if (matchIndex !== -1) {
        // Update existing row
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
      }
    });

    // Combine header and updated rows
    const finalValues = [headerRow, ...updatedValues];

    // Write back updated values to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet2!A1', // Starting range with header
      valueInputOption: 'RAW',
      resource: {
        values: finalValues,
      },
    });

    console.log('Expense data processed successfully.');
  } catch (error) {
    console.error(
      'Error processing expense data:',
      error.response ? error.response.data : error.message
    );
    throw error; // Re-throw the error for handling in the controller
  }
};





const appendOrUpdateFeeData = async (feeData, spreadsheetId, range) => {
  try {
    console.log('Fee Data:', feeData);  // Log feeData to check its structure

    // Ensure feeData is an array, even if it's a single object
    if (!Array.isArray(feeData)) {
      feeData = [feeData];  // Wrap it in an array if it's not already
    }

    const authClient = await auth.getClient();

    // Retrieve existing data to find matching rows
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map(row => [...row]); // clone to keep existing data unchanged

    feeData.forEach(newEntry => {
      // Log the new entry being processed
      console.log('Processing new entry:', newEntry);

      const matchIndex = updatedValues.findIndex(row =>
        row[0] === newEntry.receiptNo // Assuming receiptNo is in the first column (A)
      );

      // Log to check where the matching row is found
      console.log('Match Index:', matchIndex);

      const rowValues = [
        newEntry.receiptNo,        // Column A: receiptNo
        newEntry.classroomName,    // Column B: classroomName
        newEntry.classroomId,      // Column C: classroomId
        newEntry.studentName,      // Column D: studentName
        newEntry.studentId,        // Column E: studentId
        newEntry.date,             // Column F: date
        newEntry.description,      // Column G: description
        newEntry.paymentMode,      // Column H: paymentMode
        newEntry.amountPaid,       // Column I: amountPaid
        newEntry.totalFees         // Column J: totalFees
      ];

      // Log the row values to check before updating
      console.log('Row values to be inserted/updated:', rowValues);

      if (matchIndex !== -1) {
        // Update existing row if found
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
      }
    });

    // Write back updated values to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet3!A2', // Starting range for Sheet3 (adjust this as needed)
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Fee data processed successfully.');
  } catch (error) {
    console.error('Error processing fee data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the controller
  }
};



const appendOrUpdateBlacklistData = async (blacklistData, spreadsheetId, range) => {
  try {


    // Ensure blacklistData is an array, even if it's a single object
    if (!Array.isArray(blacklistData)) {
      blacklistData = [blacklistData];  // Wrap it in an array if it's not already
    }

    const authClient = await auth.getClient();

    // Retrieve existing data to find matching rows
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map(row => [...row]); // Clone to keep existing data unchanged

    blacklistData.forEach(newEntry => {
      // Log the new entry being processed

    
      // Find a matching row based on classroomName (B), studentId (D), and date (E)
      const matchIndex = updatedValues.findIndex(row =>
        row[1] === newEntry.classroomId &&   // Column B: classroomName
        row[3] === newEntry.studentId &&       // Column D: studentId
        row[4] === newEntry.date              // Column E: date
      );
    
      // Log to check where the matching row is found

    
      const rowValues = [
        newEntry.classroomName,  // Column B: classroomName
        newEntry.classroomId,    // Column C: classroomId
        newEntry.studentName,    // Column D: studentName
        newEntry.studentId,      // Column E: studentId
        newEntry.date,           // Column F: date
        newEntry.reason,         // Column G: reason
        newEntry.additionalNote  // Column H: additionalNote
      ];
    
      // Log the row values to check before updating
   
    
      if (matchIndex !== -1) {
        // Update existing row if a match is found
        updatedValues[matchIndex] = rowValues;
        console.log('Updated existing row at index:', matchIndex);
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
        console.log('Appended new row');
      }
    });
    

    // Write back updated values to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet4!A2', // Starting range for Sheet4 (adjust this as needed)
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Blacklist data processed successfully.');
  } catch (error) {
    console.error('Error processing blacklist data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the controller
  }
};



const appendOrUpdateMarksData = async (marksData, spreadsheetId, range) => {
  try {
    const authClient = await auth.getClient();

    // Retrieve existing data to find matching rows
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone to keep existing data unchanged

    // Check and update marks data if it already exists in the sheet
    marksData.forEach((newEntry) => {
      const matchIndex = updatedValues.findIndex(
        (row) =>
          row[1] === newEntry.classroomId &&
          row[3] === newEntry.studentId &&
          row[4] === newEntry.date &&
          row[6] === newEntry.subject // Assuming studentId, date, and subject are columns D, E, and G
      );

      const rowValues = [
        newEntry.classroomName,
        newEntry.classroomId,
        newEntry.studentName,
        newEntry.studentId,
        newEntry.date,
        newEntry.testType,
        newEntry.subject,
        newEntry.obtainedMarks,
        newEntry.totalMarks,
        newEntry.note,
        newEntry.rank || '', // Use the rank received from frontend
      ];

      if (matchIndex !== -1) {
        // Update existing row
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
      }
    });

    // Write back updated values to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet5!A2', // Adjust start range as needed
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Marks data processed successfully.');
  } catch (error) {
    console.error('Error processing marks data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the controller
  }
};


const appendOrUpdateVideoData = async (videoData, spreadsheetId, range) => {
  try {
    const authClient = await auth.getClient();

    // If videoData is a single object, convert it into an array
    if (!Array.isArray(videoData)) {
      videoData = [videoData];
    }

    // Retrieve existing data to find matching rows
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone to keep existing data unchanged

    // Check and update video data if it already exists in the sheet
    videoData.forEach((newEntry) => {
      const matchIndex = updatedValues.findIndex(
        (row) =>
          row[1] === newEntry.classroomId && // Classroom ID column
          row[2] === newEntry.date && // Date column
          row[5] === newEntry.videoLink // Subject column
      );

      const rowValues = [
        newEntry.classroomName, // Column A
        newEntry.classroomId,  // Column B
        newEntry.date,         // Column C
        newEntry.subject,      // Column D
        newEntry.description,  // Column E
        newEntry.videoLink,    // Column F
      ];

      if (matchIndex !== -1) {
        // Update existing row
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
      }
    });

    // Write back updated values to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet6!A2', // Adjust start range as needed
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Video data processed successfully.');
  } catch (error) {
    console.error('Error processing video data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the controller
  }
};



const appendOrUpdateScheduleData = async (scheduleData, spreadsheetId, range = 'Sheet7!A2') => {
  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Ensure scheduleData is an array for consistency
    if (!Array.isArray(scheduleData)) {
      scheduleData = [scheduleData];
    }

    // Retrieve existing data from the sheet
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone existing data

    // Check for matches and either update or append rows
    scheduleData.forEach((newEntry) => {
      const matchIndex = updatedValues.findIndex(
        (row) =>
          row[1] === newEntry.classroomId && // Match Classroom ID (Column B)
          row[2] === newEntry.date &&
          row[3] === newEntry.subject           // Match Date (Column C)
      );

      const rowValues = [
        newEntry.classroomName, // Column A
        newEntry.classroomId,   // Column B
        newEntry.date,          // Column C
        newEntry.subject,       // Column D
        newEntry.additionalNote // Column E
      ];

      if (matchIndex !== -1) {
        // Update the matching row
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
      }
    });

    // Write back updated data to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet7!A2', // Starting cell
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Schedule data processed successfully.');
  } catch (error) {
    console.error('Error processing schedule data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw for higher-level handling
  }
};

const appendOrUpdateHomeworkData = async (homeworkData, spreadsheetId, range) => {
  try {
    const authClient = await auth.getClient();

    // Retrieve existing data to find matching rows
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone to keep existing data unchanged

    // Check and update homework data if it already exists in the sheet
    homeworkData.forEach((newEntry) => {
      const matchIndex = updatedValues.findIndex(
        (row) =>
          row[1] === newEntry.classroomId && // Classroom ID
          row[3] === newEntry.studentId && // Student ID
          row[4] === newEntry.startDate && // Start Date
          row[6] === newEntry.endDate // End Date
      );

      const rowValues = [
        newEntry.classroomName,
        newEntry.classroomId,
        newEntry.studentName,
        newEntry.studentId,
        newEntry.startDate,
        newEntry.startTime,
        newEntry.endDate,
        newEntry.endTime,
        newEntry.description,
      ];

      if (matchIndex !== -1) {
        // Update existing row
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row if no match found
        updatedValues.push(rowValues);
      }
    });

    // Write back updated values to the sheet
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: 'Sheet8!A2', // Adjust start range for Sheet8
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Homework data processed successfully.');
  } catch (error) {
    console.error('Error processing homework data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the controller
  }
};


const appendOrUpdateAssignmentData = async (assignmentData, spreadsheetId) => {
  const range = 'Sheet8!A2:K'; // Define the range for Sheet8 including the K column

  try {
    const authClient = await auth.getClient();

    // Retrieve existing data from Sheet8
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone rows to maintain data structure

    // Iterate through each assignment data entry
    assignmentData.forEach((entry) => {
      const classroomId = entry.classroomId;
      const studentId = entry.studentId;
      const startDate = entry.startDate; // Assuming start date is passed in the assignmentData
      const endDate = entry.endDate;     // Assuming end date is passed in the assignmentData

      // Find matching row based on classroom ID (B), student ID (D), start date (E), and end date (G)
      const matchIndex = updatedValues.findIndex(
        (row) => row[1] === classroomId && row[3] === studentId && row[4] === startDate && row[6] === endDate
      );

      if (matchIndex !== -1) {
        // If a match is found, update column K with the description
        updatedValues[matchIndex][10] = entry.description; // Column K (index 10)
      }
      // If no match is found, do nothing (no new row is appended)
    });

    // Write back updated data to the sheet only if any update was made
    if (updatedValues !== rows) {
      await sheets.spreadsheets.values.update({
        auth: authClient,
        spreadsheetId,
        range: 'Sheet8!A2', // Start from A2 to avoid overwriting headers
        valueInputOption: 'RAW',
        resource: {
          values: updatedValues,
        },
      });
      console.log('Assignment data processed successfully.');
    } else {
      console.log('No matching entries found, no updates made.');
    }
  } catch (error) {
    console.error('Error processing assignment data:', error.response?.data || error.message);
    throw error;
  }
};


const appendOrUpdateAssignmentStatus = async (assignmentData, spreadsheetId) => {
  const sheetName = 'Sheet8'; // Define the sheet name
  const range = `${sheetName}!A2:K`; // Define the range for the specific sheet including the K column

  try {
    const authClient = await auth.getClient();  // Get authenticated client

    // Retrieve existing data from Sheet8
    const getResponse = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone rows to maintain data structure

    let changesMade = false;  // Flag to track if any changes were made

    // Iterate through each assignment data entry
    assignmentData.forEach((entry) => {
      const classroomId = entry.classroomId;
      const studentId = entry.studentId;
      const startDate = entry.startDate; // Start date passed in the assignmentData
      const endDate = entry.endDate;     // End date passed in the assignmentData

      // Find matching row based on classroom ID (B), student ID (D), start date (F), and end date (G)
      const matchIndex = updatedValues.findIndex(
        (row) => row[1] === classroomId && row[3] === studentId && row[4] === startDate && row[6] === endDate
      );

      if (matchIndex !== -1) {
        // If a match is found, update column J with status and K with remark
        updatedValues[matchIndex][9] = entry.remark;  // Column J (index 9) - Approved/Rejected status
        updatedValues[matchIndex][10] = entry.status; // Column K (index 10) - Remark
        changesMade = true;  // Mark that changes were made
      }
    });

    // Write back updated data to the sheet if any update was made
    if (changesMade) {
      await sheets.spreadsheets.values.update({
        auth: authClient,
        spreadsheetId,
        range: `${sheetName}!A2`, // Start from A2 to avoid overwriting headers
        valueInputOption: 'RAW',
        resource: {
          values: updatedValues,
        },
      });
      console.log(`Successfully updated status.`);
    } else {
      console.log(`No matching entries found no updates made.`);
    }
  } catch (error) {
    console.error(`Error processing assignment data in ${sheetName}:`, error.response?.data || error.message);
    throw error;
  }
};

const appendOrUpdateFormData = async (formData, spreadsheetId, range = 'Sheet9!A2') => {
  try {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    // Fetch existing data from the sheet
    const getResponse = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone rows to avoid modifying directly

    // Prepare new data row from formData
    const newRow = [
      formData.classroomName, // Column A
      formData.classroomId,   // Column B
      formData.date,          // Column C
      formData.topic,         // Column D
      formData.description,   // Column E
      formData.formLink,      // Column F
    ];

    // Check if the row already exists based on unique identifiers
    const matchIndex = updatedValues.findIndex(
      (row) =>
        row[1] === formData.classroomId && // Match Classroom ID (Column B)
        row[2] === formData.date &&       // Match Date (Column C)
        row[5] === formData.formLink      // Match Form Link (Column F)
    );

    if (matchIndex !== -1) {
      // Update the existing row
      updatedValues[matchIndex] = newRow;
    } else {
      // Append new row
      updatedValues.push(newRow);
    }

    // Write the updated data back to the sheet
    await sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId,
      range: 'Sheet9!A2', // Start appending from A2
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Form data processed successfully.');
  } catch (error) {
    console.error('Error appending or updating form data:', error.response?.data || error.message);
    throw error; // Rethrow for higher-level handling
  }
};


const appendOrUpdateGoogleMeetData = async (formData, spreadsheetId, range = 'Sheet10!A2') => {
  try {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    // Fetch existing data from the sheet
    const getResponse = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone rows to avoid modifying directly

    // Prepare new data row from formData
    const newRow = [
      formData.classroomName, // Column A
      formData.classroomId,   // Column B
      formData.date,          // Column C
      formData.note,          // Column D
      formData.liveLink,      // Column E
    ];

    // Check if the row already exists based on unique identifiers
    const matchIndex = updatedValues.findIndex(
      (row) =>
        row[1] === formData.classroomId && // Match Classroom ID (Column B)
        row[2] === formData.date       // Match Date (Column C)
        //row[4] === formData.liveLink      // Match Live Link (Column E)
    );

    if (matchIndex !== -1) {
      // Update the existing row
      updatedValues[matchIndex] = newRow;
    } else {
      // Append new row
      updatedValues.push(newRow);
    }

    // Write the updated data back to the sheet
    await sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId,
      range: 'Sheet10!A2', // Start appending from A2
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Google Meet data processed successfully.');
  } catch (error) {
    console.error('Error appending or updating Google Meet data:', error.response?.data || error.message);
    throw error; // Rethrow for higher-level handling
  }
};

const appendOrUpdateEmailData = async (emailData, spreadsheetId) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    // Retrieve existing data from Sheet11
    const range = 'Sheet11!A2:Z'; // Adjust the range if necessary
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = getResponse.data.values || [];
    const updatedValues = rows.map((row) => [...row]); // Clone to keep existing data unchanged

    // Process email data and update rows if necessary
    emailData.forEach((newEntry) => {
      const matchIndex = updatedValues.findIndex(
        (row) =>
          row[1] === newEntry.classroomId &&
          row[3] === newEntry.studentId
      );

      const rowValues = [
        newEntry.classroomName, // Column A
        newEntry.classroomId,  // Column B
        newEntry.studentName,
        newEntry.studentId,    // Column C
        newEntry.date,         // Column D
        newEntry.email,        // Column E
      ];

      if (matchIndex !== -1) {
        // Update existing row
        updatedValues[matchIndex] = rowValues;
      } else {
        // Append as a new row
        updatedValues.push(rowValues);

      }
    });

    // Write back updated values to the sheet
    const writeResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet11!A2', // Start appending/updating from A2
      valueInputOption: 'RAW',
      resource: {
        values: updatedValues,
      },
    });

    console.log('Email data processed successfully.');
    
  } catch (error) {
    console.error('Error processing email data:', error.response ? error.response.data : error.message);
    throw error; // Re-throw for further error handling
  }
};




module.exports = { appendOrUpdateAttendanceData, appendData, appendOrUpdateFeeData, 
  appendOrUpdateBlacklistData, appendOrUpdateMarksData, appendOrUpdateVideoData, 
  appendOrUpdateScheduleData, appendOrUpdateHomeworkData, appendOrUpdateAssignmentData, 
  appendOrUpdateAssignmentStatus, appendOrUpdateFormData, appendOrUpdateGoogleMeetData,
  appendOrUpdateEmailData };


const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const router = express.Router();

// Google authentication
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../quick-learning-440407-65b6d5beeac8.json'), // Ensure path is correct
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

// Parent folder ID in Google Drive (ensure this is correct)
const PARENT_FOLDER_ID = '16vyPLTQwJq0iZ8IPqSjZRYDrC5RPSU-p';

// Helper function to get the folder ID for the classroom
const getFolderId = async (classroomId) => {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.list({
      q: `name = '${classroomId}' and mimeType = 'application/vnd.google-apps.folder' and '${PARENT_FOLDER_ID}' in parents`,
      fields: 'files(id, name)',
    });

    if (res.data.files.length > 0) {
      return res.data.files[0].id;
    } else {
      throw new Error(`No folder found for classroomId: ${classroomId}`);
    }
  } catch (err) {
    console.error('Error getting folder ID:', err.message);
    throw new Error('Failed to get folder ID from Google Drive');
  }
};

// Helper function to get the student folder ID
const getStudentFolderId = async (classroomFolderId, studentId) => {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.list({
      q: `name = '${studentId}' and mimeType = 'application/vnd.google-apps.folder' and '${classroomFolderId}' in parents`,
      fields: 'files(id, name)',
    });

    if (res.data.files.length > 0) {
      return res.data.files[0].id;
    } else {
      throw new Error(`No folder found for studentId: ${studentId}`);
    }
  } catch (err) {
    console.error('Error getting student folder ID:', err.message);
    throw new Error('Failed to get student folder ID from Google Drive');
  }
};

// Helper function to list files in a folder
const listFilesInFolder = async (folderId) => {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType, webViewLink, description)',
    });

    return res.data.files;
  } catch (err) {
    console.error('Error listing files:', err.message);
    throw new Error('Failed to list files in the folder');
  }
};

// Route to view specific student homework
router.get('/student/homework/view/:classroomId/:studentId', async (req, res) => {

  const { classroomId, studentId } = req.params;



  try {
    // Step 1: Get the classroom folder ID
    const classroomFolderId = await getFolderId(classroomId);

    // Step 2: Get the student folder ID within the classroom folder
    const studentFolderId = await getStudentFolderId(classroomFolderId, studentId);

    // Step 3: List files in the student folder
    const files = await listFilesInFolder(studentFolderId);

    // Filter files based on MIME type
    const filteredFiles = files.filter(
      (file) =>
        file.mimeType === 'application/pdf' || file.mimeType.startsWith('video/')
    );

    // Check if there are no files
    if (filteredFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No homework found for studentId: ${studentId} in classroomId: ${classroomId}`,
      });
    }

    // Return list of filtered files (homework)
    res.status(200).json({
      success: true,
      message: `Homework for studentId: ${studentId} in classroomId: ${classroomId}`,
      files: filteredFiles,
    });
  } catch (err) {
    console.error('Error fetching homework:', err); // Detailed error log
    res.status(500).json({
      success: false,
      message: 'Error viewing student homework',
      error: err.message,
    });
  }
});


router.delete('/student/homework/delete', async (req, res) => {
  const { classroomId, studentId, name, description } = req.body;

  try {
    // Step 1: Get the classroom folder ID
    const classroomFolderId = await getFolderId(classroomId);

    // Step 2: Get the student folder ID within the classroom folder
    const studentFolderId = await getStudentFolderId(classroomFolderId, studentId);

    // Step 3: Get the list of files in the student folder
    const files = await listFilesInFolder(studentFolderId);

    // Step 4: Find the file that matches the name and description
    const fileToDelete = files.find(
      (file) => file.name === name && file.description === description
    );

    if (!fileToDelete) {
      return res.status(404).json({
        success: false,
        message: `No homework found with name: ${name} and description: ${description} for student ${studentId}`,
      });
    }

    console.log(`Homework deleted successfully`);

    // Step 5: Delete the file from Google Drive
    const drive = google.drive({ version: 'v3', auth });
    await drive.files.delete({
      fileId: fileToDelete.id,
    });

    res.status(200).json({
      success: true,
      message: `Homework '${name}' deleted successfully for student '${studentId}'!`,
    });
  } catch (error) {
    console.error('Error deleting homework:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete homework',
      error: error.message,
    });
  }
});



module.exports = router;

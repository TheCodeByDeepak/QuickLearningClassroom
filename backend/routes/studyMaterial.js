const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const router = express.Router();

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../quick-learning-440407-65b6d5beeac8.json'), // Ensure path is correct
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const PARENT_FOLDER_ID = '17kcznLbJemQMkqWLQV_MBCXI6Qbor7og';

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

router.get('/study-material/view/:classroomId', async (req, res) => {
  const { classroomId } = req.params;

  try {
    const folderId = await getFolderId(classroomId);
    const files = await listFilesInFolder(folderId);

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No study materials found for classroomId: ${classroomId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Study materials for classroomId: ${classroomId}`,
      files,
    });
  } catch (err) {
    console.error('Error viewing study materials:', err.message);
    res.status(500).json({ success: false, message: 'Error viewing study materials', error: err.message });
  }
});


router.delete('/study-material/deleteMaterial', async (req, res) => {
  const { classroomId, name, description } = req.body;

  try {
    // Get the folder ID for the given classroom
    const folderId = await getFolderId(classroomId);

    // Fetch all files in the folder
    const files = await listFilesInFolder(folderId);

    // Find the file that matches the name and description
    const fileToDelete = files.find(
      (file) => file.name === name && file.description === description
    );

    if (!fileToDelete) {
      return res.status(404).json({
        success: false,
        message: `No material found with name: ${name} and description: ${description}`,
      });
    }

    console.log(`Study Material deleted successfully`);

    // Delete the file from Google Drive
    const drive = google.drive({ version: 'v3', auth });
    await drive.files.delete({
      fileId: fileToDelete.id,
    });

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting material:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete material',
      error: error.message,
    });
  }
});

module.exports = router;

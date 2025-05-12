const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const streamifier = require('streamifier');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../quick-learning-440407-65b6d5beeac8.json'), // Ensure this path is correct
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const PARENT_FOLDER_ID = '16vyPLTQwJq0iZ8IPqSjZRYDrC5RPSU-p'; // Replace with your actual parent folder ID

// Function to get or create a folder
const getOrCreateFolder = async (name, parentId) => {
  const drive = google.drive({ version: 'v3', auth });

  try {
    const res = await drive.files.list({
      q: `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents`,
      fields: 'files(id, name)',
    });

    if (res.data.files.length > 0) {
      //console.log(`Folder "${name}" found. Returning ID: ${res.data.files[0].id}`);
      return res.data.files[0].id; // Folder exists, return its ID
    } else {
      //console.log(`Folder "${name}" not found. Creating new folder.`);
      const folderMetadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      };

      const folderRes = await drive.files.create({
        resource: folderMetadata,
        fields: 'id',
      });

      //console.log(`Folder created successfully. ID: ${folderRes.data.id}`);
      return folderRes.data.id; // New folder created, return its ID
    }
  } catch (err) {
    console.error(`Error getting or creating folder "${name}":`, err.message);
    throw new Error(`Failed to get or create folder "${name}"`);
  }
};

// Function to upload file to Google Drive
const uploadFileToDrive = async (file, classroomId, studentId, description) => {
  const drive = google.drive({ version: 'v3', auth });

  try {
    // Get or create the classroom folder
    const classroomFolderId = await getOrCreateFolder(classroomId, PARENT_FOLDER_ID);

    // Get or create the student folder inside the classroom folder
    const studentFolderId = await getOrCreateFolder(studentId, classroomFolderId);

    const fileMetadata = {
      name: file.originalname,
      parents: [studentFolderId],
      description,
    };

    const bufferStream = streamifier.createReadStream(file.buffer);

    const media = {
      mimeType: file.mimetype,
      body: bufferStream,
    };

    const res = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, name',
    });

    console.log(`File uploaded successfully. File ID: ${res.data.id}`);
    return res.data;
  } catch (err) {
    console.error('Error uploading file to Drive:', err.message);
    throw new Error('Failed to upload file to Google Drive');
  }
};

// Endpoint to upload homework
router.post('/homework/upload', upload.single('file'), async (req, res) => {
  const { description, classroomId, studentId } = req.body;

  // Validate input parameters
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  if (!description || !classroomId || !studentId) {
    console.error('Missing required fields: description, classroomId, or studentId');
    return res.status(400).json({ success: false, message: 'Description, classroomId, and studentId are required' });
  }

  try {
    console.log('Attempting to upload homework...');
    // Attempt to upload the homework file
    const uploadedFile = await uploadFileToDrive(req.file, classroomId, studentId, description);
    res.status(200).json({ success: true, message: 'Homework uploaded successfully', file: uploadedFile });
  } catch (err) {
    console.error('Error during file upload:', err.message);
    res.status(500).json({ success: false, message: 'Error uploading homework', error: err.message });
  }
});

module.exports = router;

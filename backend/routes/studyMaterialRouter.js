const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const streamifier = require('streamifier'); // Import the streamifier module

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Google Auth once and reuse it
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../quick-learning-440407-65b6d5beeac8.json'), // Update with the actual path to your service account file
  scopes: ['https://www.googleapis.com/auth/drive.file'], // Scopes for uploading files to Google Drive
});

// Define the parent folder ID where all classroom folders will reside
const PARENT_FOLDER_ID = '17kcznLbJemQMkqWLQV_MBCXI6Qbor7og'; // Replace with your actual parent folder ID

// Function to check if the folder exists in the specified parent folder
const getFolderId = async (classroomId) => {
  try {
    const drive = google.drive({ version: 'v3', auth });

    // Search for the folder within the parent folder (classroomId as the folder name)
    const res = await drive.files.list({
      q: `name = '${classroomId}' and mimeType = 'application/vnd.google-apps.folder' and '${PARENT_FOLDER_ID}' in parents`,
      fields: 'files(id, name)',
    });

    // If the folder exists, return its ID, otherwise create a new folder
    if (res.data.files.length > 0) {
      return res.data.files[0].id; // Return the folder ID
    } else {
      // If folder doesn't exist, create a new folder inside the parent folder
      const folderMetadata = {
        name: classroomId, // Use classroomId as folder name
        mimeType: 'application/vnd.google-apps.folder',
        parents: [PARENT_FOLDER_ID], // Set the parent folder ID
      };

      const folderRes = await drive.files.create({
        resource: folderMetadata,
        fields: 'id',
      });

      return folderRes.data.id; // Return the newly created folder ID
    }
  } catch (err) {
    console.error('Error checking or creating folder:', err.message);
    throw new Error('Failed to get or create folder in Google Drive');
  }
};

// Function to upload the file to Google Drive
const uploadFileToDrive = async (file, classroomId, description) => {
  try {
    const drive = google.drive({ version: 'v3', auth });

    // Get or create the folder for the specified classroomId within the specified parent folder
    const folderId = await getFolderId(classroomId);

    const fileMetadata = {
      name: file.originalname,
      parents: [folderId], // Use the classroom folder ID
      description: description, // Add description to the file metadata
    };

    // Create a stream from the buffer
    const bufferStream = streamifier.createReadStream(file.buffer);

    const media = {
      mimeType: file.mimetype,
      body: bufferStream, // Use the buffer stream
    };

    // Upload the file to the classroom folder
    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name',
    });

    console.log(`File uploaded successfully. File ID: ${res.data.id}`); // Debug log
    return res.data; // Return the uploaded file info
  } catch (err) {
    console.error('Error uploading file to Drive:', err.message);
    throw new Error('Failed to upload file to Google Drive');
  }
};

// Endpoint to handle file upload
router.post('/study-material/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const { description, classroomId } = req.body;

  // Validate that both description and classroomId are provided
  if (!description || !classroomId) {
    return res.status(400).json({ success: false, message: 'Description and classroomId are required' });
  }

  try {
    // Attempt to upload the file to the specified classroom folder in Google Drive
    const uploadedFile = await uploadFileToDrive(req.file, classroomId, description);
    res.status(200).json({ success: true, message: 'File uploaded successfully', file: uploadedFile });
  } catch (err) {
    console.error('Error during file upload:', err.message);
    res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
  }
});

module.exports = router;

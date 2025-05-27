const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, '../config/ggc.json'),
  projectId: 'weighty-psyche-461010-p8',
});

const bucketName = 'team-task-management-files';
const bucket = storage.bucket(bucketName);

// Function to upload file to Google Cloud Storage
const uploadToGCS = async (file, destination) => {
  try {
    console.log('Starting file upload to GCS:', {
      originalName: file.originalname,
      destination,
      mimetype: file.mimetype,
      size: file.size
    });

    // Check if bucket exists
    const [exists] = await bucket.exists();
    if (!exists) {
      console.log('Creating bucket:', bucketName);
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD',
        public: true
      });
    }

    const blob = bucket.file(destination);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        console.error('Error uploading to GCS:', error);
        reject(error);
      });

      blobStream.on('finish', async () => {
        try {
          // Make the file public
          await blob.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
          console.log('File uploaded successfully:', publicUrl);
          resolve(publicUrl);
        } catch (error) {
          console.error('Error making file public:', error);
          reject(error);
        }
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Error in uploadToGCS:', error);
    throw error;
  }
};

// Function to delete file from Google Cloud Storage
const deleteFromGCS = async (filename) => {
  try {
    await bucket.file(filename).delete();
    console.log('File deleted successfully:', filename);
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    throw error;
  }
};

module.exports = {
  uploadToGCS,
  deleteFromGCS,
  bucket
}; 
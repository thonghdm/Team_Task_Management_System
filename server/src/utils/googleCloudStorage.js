const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
const keyFilename = process.env.NODE_ENV === 'production' ? '/etc/secrets/ggc.json' : path.join(__dirname, '../config/ggc.json')

const storage = new Storage({
  keyFilename: keyFilename,
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
      size: file.size,
      buffer: file.buffer ? 'Buffer exists' : 'No buffer'
    });

    // Check if bucket exists
    const [exists] = await bucket.exists();
    if (!exists) {
      console.log('Creating bucket:', bucketName);
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD',
        public: false // Set bucket to private
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
          // Instead of generating a signed URL, just return the file path
          const filePath = `${bucketName}/${destination}`;
          console.log('File uploaded successfully:', filePath);
          resolve(filePath);
        } catch (error) {
          console.error('Error getting file path:', error);
          reject(error);
        }
      });

      // Ensure file.buffer is a proper Buffer
      if (!file.buffer) {
        reject(new Error('No file buffer provided'));
        return;
      }

      const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
      blobStream.end(buffer);
    });
  } catch (error) {
    console.error('Error in uploadToGCS:', error);
    throw error;
  }
};

// Function to download file from Google Cloud Storage
const downloadFromGCS = async (filename) => {
  try {
    console.log('Attempting to download file from GCS:', filename);

    const file = bucket.file(filename);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error('File not found');
    }

    // Get file metadata
    const [metadata] = await file.getMetadata();
    console.log('File metadata:', metadata);

    // Download file buffer
    const [buffer] = await file.download();
    console.log('File downloaded, buffer size:', buffer.length);

    // Ensure buffer is valid
    if (!buffer || buffer.length === 0) {
      throw new Error('Downloaded file is empty');
    }

    return {
      buffer,
      metadata: {
        contentType: metadata.contentType || 'application/octet-stream',
        size: metadata.size || buffer.length,
        name: filename.split('/').pop()
      }
    };
  } catch (error) {
    console.error('Error downloading from GCS:', error);
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

// Function to generate signed URL for file access
const generateSignedUrl = async (filename) => {
  try {
    const [url] = await bucket.file(filename).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};
const uploadChatToGCS = async (file, destination) => {
  try {
    console.log('Starting file upload to GCS:', {
      originalName: file.originalname,
      destination,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer ? 'Buffer exists' : 'No buffer'
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
          // Generate signed URL instead of making public
          const [url] = await blob.getSignedUrl({
            action: 'read',
            expires: Date.now() + 14400 * 60 * 1000, // 10days
          });

          console.log('File uploaded successfully:', url);
          resolve(url);
        } catch (error) {
          console.error('Error generating signed URL:', error);
          reject(error);
        }
      });

      // Ensure file.buffer is a proper Buffer
      if (!file.buffer) {
        reject(new Error('No file buffer provided'));
        return;
      }

      const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
      blobStream.end(buffer);
    });
  } catch (error) {
    console.error('Error in uploadToGCS:', error);
    throw error;
  }
};

module.exports = {
  uploadToGCS,
  deleteFromGCS,
  downloadFromGCS,
  generateSignedUrl,
  uploadChatToGCS,
  bucket
}; 
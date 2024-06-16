const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const storage = new Storage();
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

const uploadImage = async (file) => {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(uuidv4() + path.extname(file.hapi.filename));
    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.hapi.headers['content-type'],
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });

        file.pipe(blobStream);
    });
};

module.exports = { uploadImage };

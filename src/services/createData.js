const { Firestore } = require('@google-cloud/firestore');
const { uploadImage } = require('./storage');

async function createData(id, data, file) {
    const db = new Firestore();
    const sampahCollection = db.collection('sampah');

    if (file) {
        data.imageUrl = await uploadImage(file);
    }

    return sampahCollection.doc(id).set(data);
}

module.exports = createData;

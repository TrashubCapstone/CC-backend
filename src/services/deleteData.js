const { Firestore } = require('@google-cloud/firestore');

async function deleteData(id) {
    const db = new Firestore();

    const sampahCollection = db.collection('sampah');
    return sampahCollection.doc(id).delete();
}

module.exports = deleteData;
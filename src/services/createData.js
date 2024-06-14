const { Firestore } = require('@google-cloud/firestore');

async function createData(id, data) {
const db = new Firestore();

const sampahCollection = db.collection('sampah');
return sampahCollection.doc(id).set(data);
}

module.exports = createData;
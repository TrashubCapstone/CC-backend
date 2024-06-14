const { Firestore } = require("@google-cloud/firestore");

async function getData() {
    const firestore = new Firestore();
    const snapshot = await firestore.collection('sampah').get();
    if (snapshot.empty) {
      return [];
    }
  
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
  
    return data;
};

module.exports = getData;
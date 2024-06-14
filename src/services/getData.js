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


// const db = new Firestore();

//     const sampahCollection = db.collection("sampah");
//     const snapshot = await sampahCollection.get();

//     if (snapshot.empty) {
//         return [];
//     }

//     const data = [];
//     snapshot.forEach((doc) => {
//         const currData = {
//             id: doc.id,
//             data: doc.data()
//         }
//         data.push(currData);
//     });
//     return data;
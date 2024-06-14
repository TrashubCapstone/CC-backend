const { Firestore } = require('@google-cloud/firestore');

const updateData = async (id, data) => {
    const firestore = new Firestore();
    const docRef = firestore.collection('sampah').doc(id);
    await docRef.update(data);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
};

module.exports = updateData;
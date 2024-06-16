const { Firestore } = require('@google-cloud/firestore');
const { uploadImage } = require('./storage');

const updateData = async (id, data, file) => {
    const firestore = new Firestore();
    const docRef = firestore.collection('sampah').doc(id);

    if (file) {
        const imageUrl = await uploadImage(file);
        data.imageUrl = imageUrl;
    }

    // Remove undefined values to avoid issues with Firestore
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    await docRef.update(data);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
};

module.exports = updateData;

const { Firestore } = require('@google-cloud/firestore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ClientError = require('../exceptions/ClientError');

const firestore = new Firestore();
const usersCollection = firestore.collection('users');
const invalidTokensCollection = firestore.collection('invalidTokens'); // Collection for invalidated tokens
const secretKey = process.env.JWT_SECRET || 'my_key';

const registerUser = async (data) => {
    const { email, password } = data;
    const userSnapshot = await usersCollection.where('email', '==', email).get();
    if (!userSnapshot.empty) {
        throw new ClientError('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = usersCollection.doc();
    await userRef.set({ email, password: hashedPassword });
    return { id: userRef.id, email };
};

const loginUser = async (data) => {
    const { email, password } = data;
    const userSnapshot = await usersCollection.where('email', '==', email).get();
    if (userSnapshot.empty) {
        throw new ClientError('Invalid email or password');
    }
    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new ClientError('Invalid email or password');
    }
    const token = jwt.sign({ id: userDoc.id, email: user.email }, secretKey, { expiresIn: '1h' });
    return { token };
};

const logoutUser = async (token) => {
    await invalidTokensCollection.add({ token, invalidatedAt: new Date().toISOString() });
    return { message: 'Logged out successfully' };
};

const verifyToken = async (token) => {
    const invalidTokenSnapshot = await invalidTokensCollection.where('token', '==', token).get();
    if (!invalidTokenSnapshot.empty) {
        throw new ClientError('Invalid token');
    }
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new ClientError('Invalid token');
    }
};

module.exports = { registerUser, loginUser, logoutUser, verifyToken };
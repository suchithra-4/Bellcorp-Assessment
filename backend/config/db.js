// Load environment variables
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    // If we're forcing mock mode or MONGODB_URI is not provided
    if (process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI) {
        console.log(' Using Mock In-Memory Database');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.log(' Falling back to Mock In-Memory Database');
        process.env.USE_MOCK_DB = 'true';
    }
};

module.exports = connectDB;

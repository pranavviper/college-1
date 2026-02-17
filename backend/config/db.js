const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // If already connected, reuse connection
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        console.log('Attempting to connect to MongoDB in db.js...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Options to avoid deprecation warnings and ensure stability
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // In serverless, we might not want to exit process, but for now log error
        // process.exit(1); 
    }
};

module.exports = connectDB;

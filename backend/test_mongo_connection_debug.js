const mongoose = require('mongoose');

const uri = "mongodb+srv://pranavviper7_db_user:credit-transfer@cluster0.vqptdz4.mongodb.net/College?appName=Cluster0";

console.log("Attempting to connect to MongoDB...");

mongoose.set('debug', true); // Enable debug mode

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection failed:", err);
        process.exit(1);
    });

const mongoose = require('mongoose');
const User = require('./models/User');
const Application = require('./models/Application');
require('dotenv').config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const students = await User.find({ role: 'student' });
        console.log('Students:', students.length);

        const faculty = await User.find({ role: 'faculty' });
        console.log('Faculty:', faculty.length);
        faculty.forEach(f => console.log('Faculty Email:', f.email));

        const apps = await Application.find({});
        console.log('Applications:', apps.length);
        console.log('Sample App:', apps[0]);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();

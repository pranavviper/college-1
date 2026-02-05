const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createFaculty = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existing = await User.findOne({ email: 'newfaculty@rajalakshmi.edu.in' });
        if (existing) {
            await User.deleteOne({ email: 'newfaculty@rajalakshmi.edu.in' });
        }

        const user = await User.create({
            name: 'New Faculty',
            email: 'newfaculty@rajalakshmi.edu.in',
            password: 'password123',
            role: 'faculty',
            department: 'CSE'
        });

        console.log('Created Faculty:', user);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createFaculty();

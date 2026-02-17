const User = require('../models/User');

const ensureAdmin = async () => {
    try {
        const adminEmail = 'admin@rajalakshmi.edu.in';
        const user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log('Default admin user not found. Creating...');
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'adminpassword', // Should be changed immediately
                role: 'admin',
                department: 'Administration',
                registerNumber: 'ADMIN001'
            });
            console.log('Default admin user created successfully.');
        } else {
            // Ensure the user has admin role if it was somehow changed
            if (user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
                console.log('Restored admin role to default admin user.');
            }
        }
    } catch (error) {
        console.error(`Error ensuring default admin: ${error.message}`);
        // Don't exit process, just log error so server can still start
    }
};

module.exports = ensureAdmin;

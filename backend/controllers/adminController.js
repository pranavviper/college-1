const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Application = require('../models/Application');
const ODRequest = require('../models/ODRequest');
const sendEmail = require('../utils/sendEmail');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalApplications = await Application.countDocuments();
    const totalODRequests = await ODRequest.countDocuments();

    // Get recent activity (last 5 applications)
    const recentApplications = await Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('student', 'name email registerNumber');

    res.json({
        counts: {
            students: totalStudents,
            faculty: totalFaculty,
            applications: totalApplications,
            odRequests: totalODRequests
        },
        recentActivity: recentApplications
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, department, registerNumber } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        department,
        registerNumber
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        // Send login credentials via email
        try {
            const message = `
                Dear ${user.name},

                Your account has been created on the College Portal.

                Here are your login credentials:
                Email: ${user.email}
                Password: ${password}
                Role: ${user.role}

                Please login and change your password immediately.

                Regards,
                Admin Team
            `;

            await sendEmail({
                email: user.email,
                subject: 'Your College Portal Login Credentials',
                message
            });
        } catch (error) {
            console.error('Error sending welcome email:', error);
            // We don't want to fail the request if email fails, but maybe log it
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.department = req.body.department || user.department;
        user.registerNumber = req.body.registerNumber || user.registerNumber;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
            registerNumber: updatedUser.registerNumber
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Check if trying to delete the default admin
        if (user.email === 'admin@rajalakshmi.edu.in') {
            res.status(400);
            throw new Error('Cannot delete the default system admin');
        }

        // Optional: Protect all admins? 
        // For now, let's allow deleting other admins if the current user is an admin (which they must be to hit this route)
        // But the previous code prevented deleting ANY admin. User request was "can't delete admin user" which might imply the default one specifically.
        // Let's keep the broad restriction for safety, OR just the specific one. 
        // "can't delete admin user" - singular, likely referring to the default one.
        // However, existing code had:
        /*
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        */
        // I will keep the broad restriction as it's safer, but customize message for default admin.

        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getStats,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};

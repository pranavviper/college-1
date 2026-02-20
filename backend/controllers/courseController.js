const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private (Faculty/Admin)
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Faculty/Admin)
const createCourse = async (req, res) => {
    const { name, code, department, credits, semester } = req.body;

    if (!name || !code || !department || !credits) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const courseExists = await Course.findOne({ code });

    if (courseExists) {
        res.status(400);
        throw new Error('Course code already exists');
    }

    const course = await Course.create({
        name,
        code,
        department,
        credits,
        semester,
        isCreditTransferEligible
    });

    if (course) {
        res.status(201).json(course);
    } else {
        res.status(400);
        throw new Error('Invalid course data');
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Faculty/Admin)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Faculty/Admin)
const updateCourse = async (req, res) => {
    const { name, code, department, credits, semester, isCreditTransferEligible } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
        course.name = name || course.name;
        course.code = code || course.code;
        course.department = department || course.department;
        course.credits = credits || course.credits;
        course.semester = semester || course.semester;
        if (isCreditTransferEligible !== undefined) {
            course.isCreditTransferEligible = isCreditTransferEligible;
        }

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
};

module.exports = {
    getCourses,
    createCourse,
    deleteCourse,
    updateCourse
};

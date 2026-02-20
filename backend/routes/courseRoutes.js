const express = require('express');
const router = express.Router();
const { getCourses, createCourse, deleteCourse, updateCourse } = require('../controllers/courseController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCourses)
    .post(protect, faculty, createCourse);

router.route('/:id')
router.route('/:id')
    .delete(protect, faculty, deleteCourse)
    .put(protect, faculty, updateCourse);

module.exports = router;

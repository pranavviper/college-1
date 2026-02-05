const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// const File = require('../models/File');

// Use memory storage to get buffer
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('PDFs only!');
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit for Vercel Serverless
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @route   POST /api/upload
// @desc    Upload file to MongoDB
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const newFile = new File({
            filename: `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`,
            contentType: req.file.mimetype,
            data: req.file.buffer
        });

        const savedFile = await newFile.save();

        res.send({
            message: 'File uploaded',
            filePath: `/api/upload/file/${savedFile._id}`, // This URL will now point to our backend route
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error during upload');
    }
});

// @route   GET /api/upload/file/:id
// @desc    Serve file from MongoDB
router.get('/file/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.set('Content-Type', file.contentType);
        // Optional: ensure filename is safe
        res.send(file.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    }
}, {
    timestamps: true
});

const File = mongoose.model('File', fileSchema);

module.exports = File;

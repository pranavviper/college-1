const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true }, // CSBS, CSE, IT, etc.
    credits: { type: Number, required: true },
    semester: { type: Number },
    isCreditTransferEligible: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

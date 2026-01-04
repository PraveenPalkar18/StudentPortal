// models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true },
    semester: { type: String },
    marks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);

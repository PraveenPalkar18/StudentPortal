// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true },
    branch: { type: String },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

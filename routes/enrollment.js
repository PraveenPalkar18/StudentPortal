// routes/enrollment.js
const express = require('express');
const { requireLogin } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

// List all for logged in student
router.get('/', requireLogin, async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).lean();
  res.render('enrollments/index', { user: req.user, enrollments });
});

// Create
router.post('/', requireLogin, async (req, res) => {
  const { courseName, courseCode, semester, marks } = req.body;
  try {
    await Enrollment.create({
      student: req.user._id,
      courseName,
      courseCode,
      semester,
      marks
    });
    res.redirect('/enrollments');
  } catch (err) {
    console.error(err);
    res.redirect('/enrollments');
  }
});

// Edit form
router.get('/:id/edit', requireLogin, async (req, res) => {
  const enrollment = await Enrollment.findOne({
    _id: req.params.id,
    student: req.user._id
  }).lean();
  if (!enrollment) return res.redirect('/enrollments');
  res.render('enrollments/edit', { user: req.user, enrollment });
});

// Update
router.put('/:id', requireLogin, async (req, res) => {
  const { courseName, courseCode, semester, marks } = req.body;
  try {
    await Enrollment.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      { courseName, courseCode, semester, marks }
    );
    res.redirect('/enrollments');
  } catch (err) {
    console.error(err);
    res.redirect('/enrollments');
  }
});

// Delete
router.delete('/:id', requireLogin, async (req, res) => {
  try {
    await Enrollment.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id
    });
    res.redirect('/enrollments');
  } catch (err) {
    console.error(err);
    res.redirect('/enrollments');
  }
});

module.exports = router;

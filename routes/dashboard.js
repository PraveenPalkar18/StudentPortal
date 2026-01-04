// routes/dashboard.js
const express = require('express');
const { requireLogin } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Project = require('../models/Project');

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).lean();
    const projects = await Project.find({ student: req.user._id }).lean();

    res.render('dashboard/index', {
      user: req.user,
      enrollments,
      projects
    });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
});

module.exports = router;

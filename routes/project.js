// routes/project.js
const express = require('express');
const { requireLogin } = require('../middleware/auth');
const Project = require('../models/Project');

const router = express.Router();

// List
router.get('/', requireLogin, async (req, res) => {
  const projects = await Project.find({ student: req.user._id }).lean();
  res.render('projects/index', { user: req.user, projects });
});

// Create
router.post('/', requireLogin, async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    await Project.create({
      student: req.user._id,
      title,
      description,
      status,
      dueDate: dueDate || null
    });
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
});

// Edit form
router.get('/:id/edit', requireLogin, async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    student: req.user._id
  }).lean();
  if (!project) return res.redirect('/projects');
  res.render('projects/edit', { user: req.user, project });
});

// Update
router.put('/:id', requireLogin, async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    await Project.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      { title, description, status, dueDate: dueDate || null }
    );
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
});

// Delete
router.delete('/:id', requireLogin, async (req, res) => {
  try {
    await Project.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id
    });
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
});

module.exports = router;

// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});

// Register
router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});

router.post('/register', async (req, res) => {
  const { name, rollNo, branch, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Passwords do not match' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('auth/register', { error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, rollNo, branch, email, passwordHash });
    await user.save();

    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Something went wrong' });
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.render('auth/login', { error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Something went wrong' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

// middleware/auth.js
const User = require('../models/User');

exports.requireLogin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  // attach logged-in user object
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      req.session.destroy(() => {});
      return res.redirect('/login');
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.redirect('/login');
  }
};

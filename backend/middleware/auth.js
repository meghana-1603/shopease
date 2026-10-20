
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';

    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Please log in to continue.',
      });
    }

    const decoded = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select(
      '_id name email role'
    );

    if (!user) {
      return res.status(401).json({
        message: 'Account not found. Please log in again.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message:
        'Your session is invalid or expired. Please log in again.',
    });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required.',
    });
  }

  next();
}

module.exports = { protect, adminOnly };

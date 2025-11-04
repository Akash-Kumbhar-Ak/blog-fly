const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from Authorization header (format: Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]; // ✅ fixed split
    }

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 3. Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 4. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 5. Grant access
    req.user = currentUser;
    next();

  } catch (error) {
    console.error('AUTH MIDDLEWARE ERROR:', error.message);
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token or session expired! Please log in again.',
    });
  }
};

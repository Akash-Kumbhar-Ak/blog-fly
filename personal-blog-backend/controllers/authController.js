const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Validate input
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password',
      });
    }

    // 2️⃣ Check if user exists and include password field for comparison
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials',
      });
    }

    // 3️⃣ Create JWT payload
    const payload = { id: user._id };

    // 4️⃣ Sign token (⚠️ fixed typo: JWT_SECRETE → JWT_SECRET)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN || '7d', // default 7 days
    });

    // 5️⃣ Respond with token
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    res.status(500).json({
      status: 'fail',
      message: 'An internal server error occurred',
    });
  }
};

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Get Token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No Token. Authorization Denied' });
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //decoded.user contains the user.id (users.js line64)
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

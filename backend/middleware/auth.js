/**
 * Authentication Middleware
 *
 * TODO: Implement JWT authentication middleware
 * Verify token and attach user to request object
 */

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // TODO: Extract token from Authorization header
  // TODO: Verify token using JWT_SECRET
  // TODO: Attach user info to req.user
  // TODO: Handle errors (invalid token, expired, etc.)

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  // TODO: Check if user is admin
  // TODO: Return 403 if not admin

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
};

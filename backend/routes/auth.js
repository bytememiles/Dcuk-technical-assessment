/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  verifyPrivy,
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register (legacy - kept for backward compatibility)
router.post('/register', register);

// POST /api/auth/login (legacy - kept for backward compatibility)
router.post('/login', login);

// POST /api/auth/privy/verify - Privy SSO authentication
router.post('/privy/verify', verifyPrivy);

// GET /api/auth/me
router.get('/me', authenticateToken, getMe);

module.exports = router;

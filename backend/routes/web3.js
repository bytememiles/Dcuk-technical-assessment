/**
 * Web3 Routes
 */

const express = require('express');
const router = express.Router();
const { verifyOwnership } = require('../controllers/web3Controller');
const { authenticateToken } = require('../middleware/auth');

// POST /api/web3/verify-ownership
router.post('/verify-ownership', authenticateToken, verifyOwnership);

module.exports = router;

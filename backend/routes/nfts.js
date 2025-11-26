/**
 * NFT Routes
 */

const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const {
  getAllNFTs,
  getNFTById,
  createNFT,
  searchNFTs,
  verifyOwnership,
  getRelatedNFTs,
} = require('../controllers/nftController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Validation middleware
const validateNFTQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number'),
  query('sortBy')
    .optional()
    .isIn(['price', 'date', 'name'])
    .withMessage('Sort by must be price, date, or name'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// GET /api/nfts - List all NFTs with pagination, filtering, and sorting
router.get('/', validateNFTQuery, getAllNFTs);

// GET /api/nfts/search - Search NFTs
router.get('/search', searchNFTs);

// GET /api/nfts/:id - Get NFT details
router.get('/:id', getNFTById);

// GET /api/nfts/:id/related - Get related NFTs
router.get('/:id/related', getRelatedNFTs);

// POST /api/nfts/:id/verify-ownership - Verify NFT ownership
router.post('/:id/verify-ownership', authenticateToken, verifyOwnership);

// POST /api/nfts - Create NFT listing (admin only)
router.post('/', authenticateToken, requireAdmin, createNFT);

module.exports = router;

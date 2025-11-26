/**
 * NFT Routes
 */

const express = require('express');
const router = express.Router();
const { getAllNFTs, getNFTById, createNFT, searchNFTs } = require('../controllers/nftController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/nfts - List all NFTs with pagination
router.get('/', getAllNFTs);

// GET /api/nfts/search - Search NFTs
router.get('/search', searchNFTs);

// GET /api/nfts/:id - Get NFT details
router.get('/:id', getNFTById);

// POST /api/nfts - Create NFT listing (admin only)
router.post('/', authenticateToken, requireAdmin, createNFT);

module.exports = router;

/**
 * Cart Routes
 */

const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/cart - Get user's cart
router.get('/', authenticateToken, getCart);

// POST /api/cart/add - Add NFT to cart
router.post('/add', authenticateToken, addToCart);

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', authenticateToken, removeFromCart);

// POST /api/cart/clear - Clear cart
router.post('/clear', authenticateToken, clearCart);

module.exports = router;

/**
 * Orders Routes
 */

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/orders - Create order from cart
router.post('/', authenticateToken, createOrder);

// GET /api/orders - Get user's orders
router.get('/', authenticateToken, getOrders);

// GET /api/orders/:id - Get order details
router.get('/:id', authenticateToken, getOrderById);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', authenticateToken, updateOrderStatus);

module.exports = router;

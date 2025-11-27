/**
 * Order Controller
 * Handles order management operations
 */

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const CartItem = require('../models/CartItem');
const mongoose = require('mongoose');
const transactionMonitor = require('../services/transactionMonitor');

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

/**
 * Calculate platform fee (2.5% of subtotal)
 */
const calculateFee = subtotal => {
  return subtotal * 0.025; // 2.5% platform fee
};

/**
 * Create order from cart
 */
exports.createOrder = async (req, res) => {
  try {
    const { transaction_hash } = req.body;

    // Get cart items with NFT details
    const cartItems = await CartItem.find({ user_id: req.user.id }).populate(
      'nft_id'
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.nft_id.price);
      return sum + price * item.quantity;
    }, 0);

    // Calculate fee
    const fee = calculateFee(subtotal);

    // Calculate total (subtotal + fee)
    const totalAmount = subtotal + fee;

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let orderExists = true;
    while (orderExists) {
      const existing = await Order.findOne({ order_number: orderNumber });
      if (!existing) {
        orderExists = false;
      } else {
        orderNumber = generateOrderNumber();
      }
    }

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      order_number: orderNumber,
      subtotal: subtotal.toString(),
      fee: fee.toString(),
      total_amount: totalAmount.toString(),
      status: 'pending',
      transaction_hash: transaction_hash || null,
      transaction_status: transaction_hash ? 'pending' : null,
    });

    // Create order items
    const orderItems = await Promise.all(
      cartItems.map(item => {
        return OrderItem.create({
          order_id: order._id,
          nft_id: item.nft_id._id,
          quantity: item.quantity,
          price: item.nft_id.price,
        });
      })
    );

    // Clear cart
    await CartItem.deleteMany({ user_id: req.user.id });

    // Start monitoring transaction if provided
    if (transaction_hash) {
      transactionMonitor.startMonitoring(order._id, transaction_hash);
    }

    // Populate order items for response
    const orderItemsForResponse = await OrderItem.find({
      order_id: order._id,
    }).populate('nft_id');
    const formattedItems = orderItemsForResponse.map(item => {
      const nft = item.nft_id;
      return {
        id: item._id,
        order_id: item.order_id,
        nft_id: item.nft_id._id,
        quantity: item.quantity,
        price: item.price,
        name: nft.name,
        description: nft.description,
        image_url: nft.image_url,
      };
    });

    res.status(201).json({
      order: {
        ...order.toJSON(),
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

/**
 * Get user's orders with filtering and sorting
 */
exports.getOrders = async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user_id: req.user.id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Sorting
    const sortOptions = {};
    const validSortFields = [
      'createdAt',
      'total_amount',
      'status',
      'order_number',
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

/**
 * Get order by ID
 */

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderItems = await OrderItem.find({ order_id: order._id }).populate(
      'nft_id'
    );

    // Transform to match expected format
    const formattedItems = orderItems.map(item => {
      const nft = item.nft_id;
      return {
        id: item._id,
        order_id: item.order_id,
        nft_id: item.nft_id._id,
        quantity: item.quantity,
        price: item.price,
        name: nft.name,
        description: nft.description,
        image_url: nft.image_url,
        token_id: nft.token_id,
        contract_address: nft.contract_address,
      };
    });

    res.json({
      order: {
        ...order.toJSON(),
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transaction_hash, transaction_status, failure_reason } =
      req.body;

    const order = await Order.findOne({
      _id: id,
      user_id: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Validate status
    const validStatuses = [
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update order
    if (status) order.status = status;
    if (transaction_hash !== undefined)
      order.transaction_hash = transaction_hash;
    if (transaction_status) order.transaction_status = transaction_status;
    if (failure_reason !== undefined) order.failure_reason = failure_reason;

    await order.save();

    res.json({ order });
  } catch (error) {
    console.error('Update order status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

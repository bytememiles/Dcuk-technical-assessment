/**
 * Cart Controller
 * Handles cart management operations
 */

const CartItem = require('../models/CartItem');
const NFT = require('../models/NFT');
const logger = require('../config/logger');

/**
 * Get user's cart
 */
exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ user_id: req.user.id })
      .populate('nft_id')
      .sort({ createdAt: -1 });

    // Transform to match expected format
    const formattedItems = items.map(item => {
      const nft = item.nft_id;
      return {
        id: item._id,
        user_id: item.user_id,
        nft_id: item.nft_id._id,
        quantity: item.quantity,
        name: nft.name,
        description: nft.description,
        image_url: nft.image_url,
        price: nft.price,
        token_id: nft.token_id,
        contract_address: nft.contract_address,
        created_at: item.createdAt,
      };
    });

    res.json({ items: formattedItems });
  } catch (error) {
    logger.error('Get cart error:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

/**
 * Add item to cart
 */
exports.addToCart = async (req, res) => {
  try {
    const { nft_id, quantity = 1 } = req.body;

    if (!nft_id) {
      return res.status(400).json({ error: 'NFT ID required' });
    }

    // Check if NFT exists
    const nft = await NFT.findById(nft_id);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Check if item already in cart
    const existing = await CartItem.findOne({
      user_id: req.user.id,
      nft_id: nft_id,
    });

    if (existing) {
      // Update quantity
      existing.quantity += quantity;
      await existing.save();
    } else {
      // Create new item
      await CartItem.create({
        user_id: req.user.id,
        nft_id: nft_id,
        quantity: quantity,
      });
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    logger.error('Add to cart error:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      nftId: req.body.nft_id,
    });
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'NFT not found' });
    }
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

/**
 * Remove item from cart
 */
exports.removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findOneAndDelete({
      _id: req.params.itemId,
      user_id: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    logger.error('Remove from cart error:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      itemId: req.params.itemId,
    });
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

/**
 * Clear cart
 */
exports.clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ user_id: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    logger.error('Clear cart error:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

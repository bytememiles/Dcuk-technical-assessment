/**
 * Cart Item Model
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nft_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

// Ensure one cart item per user per NFT
cartItemSchema.index({ user_id: 1, nft_id: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);


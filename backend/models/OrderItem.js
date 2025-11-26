/**
 * Order Item Model
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    nft_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NFT',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => (v ? v.toString() : '0'),
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);

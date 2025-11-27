/**
 * Order Model
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order_number: {
      type: String,
      unique: true,
      required: true,
    },
    subtotal: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => (v ? v.toString() : '0'),
    },
    fee: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: '0',
      get: v => (v ? v.toString() : '0'),
    },
    total_amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => (v ? v.toString() : '0'),
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    transaction_hash: {
      type: String,
      default: null,
    },
    transaction_status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', null],
      default: null,
    },
    failure_reason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model('Order', orderSchema);

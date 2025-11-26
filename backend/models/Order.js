/**
 * Order Model
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total_amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    get: (v) => v ? v.toString() : '0'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  transaction_hash: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { getters: true }
});

module.exports = mongoose.model('Order', orderSchema);



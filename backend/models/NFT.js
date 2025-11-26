/**
 * NFT Model
 */

const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => (v ? v.toString() : '0'),
    },
    token_id: {
      type: String,
      default: null,
    },
    contract_address: {
      type: String,
      default: null,
    },
    owner_address: {
      type: String,
      default: null,
    },
    verified_owners: [
      {
        address: {
          type: String,
          required: true,
        },
        verified_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    verification_timestamp: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model('NFT', nftSchema);

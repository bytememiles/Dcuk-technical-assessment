/**
 * User Model
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: false, // Not required for Privy users
    },
    privy_user_id: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but enforce uniqueness when present
    },
    auth_method: {
      type: String,
      enum: ['password', 'privy_email', 'privy_google', 'privy_wallet'],
      default: 'password',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    wallet_address: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Remove password_hash from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

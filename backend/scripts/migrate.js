/**
 * Database Migration Script
 * Sets up database indexes and ensures proper schema
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const logger = require('../config/logger');
const User = require('../models/User');
const NFT = require('../models/NFT');
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');

const migrate = async () => {
  try {
    logger.info('Starting database migration...');

    // Connect to database
    await connectDB();

    // Create indexes
    logger.info('Creating indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex(
      { privy_user_id: 1 },
      { unique: true, sparse: true }
    );
    logger.info('✓ User indexes created');

    // NFT indexes
    await NFT.collection.createIndex({ name: 'text', description: 'text' });
    await NFT.collection.createIndex({ price: 1 });
    await NFT.collection.createIndex({ contract_address: 1 });
    await NFT.collection.createIndex({ owner_address: 1 });
    await NFT.collection.createIndex({ createdAt: -1 });
    // Index for verified_owners array queries
    await NFT.collection.createIndex({ 'verified_owners.address': 1 });
    logger.info('✓ NFT indexes created');

    // Order indexes
    await Order.collection.createIndex({ user_id: 1, createdAt: -1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ order_number: 1 }, { unique: true });
    await Order.collection.createIndex(
      { transaction_hash: 1 },
      { sparse: true }
    );
    logger.info('✓ Order indexes created');

    // CartItem indexes
    await CartItem.collection.createIndex(
      { user_id: 1, nft_id: 1 },
      { unique: true }
    );
    logger.info('✓ CartItem indexes created');

    logger.info('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

migrate();

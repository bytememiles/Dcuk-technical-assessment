/**
 * Database Migration Script
 * Sets up database indexes and ensures proper schema
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const NFT = require('../models/NFT');
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');

const migrate = async () => {
  try {
    console.log('Starting database migration...');

    // Connect to database
    await connectDB();

    // Create indexes
    console.log('Creating indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✓ User indexes created');

    // NFT indexes
    await NFT.collection.createIndex({ name: 'text', description: 'text' });
    await NFT.collection.createIndex({ price: 1 });
    await NFT.collection.createIndex({ contract_address: 1 });
    await NFT.collection.createIndex({ owner_address: 1 });
    await NFT.collection.createIndex({ createdAt: -1 });
    console.log('✓ NFT indexes created');

    // Order indexes
    await Order.collection.createIndex({ user_id: 1, createdAt: -1 });
    await Order.collection.createIndex({ status: 1 });
    console.log('✓ Order indexes created');

    // CartItem indexes
    await CartItem.collection.createIndex(
      { user_id: 1, nft_id: 1 },
      { unique: true }
    );
    console.log('✓ CartItem indexes created');

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();

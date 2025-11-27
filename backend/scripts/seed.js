/**
 * Database Seed Script
 * Populates the database with initial sample data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');
const logger = require('../config/logger');
const User = require('../models/User');
const NFT = require('../models/NFT');
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');

const seed = async () => {
  try {
    logger.info('Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    logger.info('Clearing existing data...');
    await User.deleteMany({});
    await NFT.deleteMany({});
    await Order.deleteMany({});
    await CartItem.deleteMany({});
    logger.info('✓ Existing data cleared');

    // Create admin user
    logger.info('Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@dcuk.com',
      password_hash: adminPasswordHash,
      role: 'admin',
      wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      auth_method: 'password',
    });
    logger.info('✓ Admin user created:', { email: adminUser.email });

    // Create test user
    logger.info('Creating test user...');
    const userPasswordHash = await bcrypt.hash('user123', 10);
    const testUser = await User.create({
      email: 'user@dcuk.com',
      password_hash: userPasswordHash,
      role: 'user',
      wallet_address: '0x8ba1f109551bD432803012645Hac136c22C177E9',
      auth_method: 'password',
    });
    logger.info('✓ Test user created:', { email: testUser.email });

    // Create sample NFTs
    logger.info('Creating sample NFTs...');
    const sampleNFTs = [
      {
        name: 'Digital Art #1',
        description:
          'A beautiful piece of digital art showcasing modern aesthetics',
        image_url: '/images/icon1.png',
        price: '0.5',
        token_id: '1',
        contract_address: '0x1234567890123456789012345678901234567890',
        owner_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        // Add verified owner for first NFT (admin)
        verified_owners: [
          {
            address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            verified_at: new Date(),
          },
        ],
        verification_timestamp: new Date(),
      },
      {
        name: 'Crypto Collectible #2',
        description: 'Rare collectible NFT with unique properties',
        image_url: '/images/icon2.png',
        price: '1.2',
        token_id: '2',
        contract_address: '0x1234567890123456789012345678901234567890',
        owner_address: '0x8ba1f109551bD432803012645Hac136c22C177E9',
        // Add verified owner for second NFT (user)
        verified_owners: [
          {
            address: '0x8ba1f109551bD432803012645Hac136c22C177E9',
            verified_at: new Date(),
          },
        ],
        verification_timestamp: new Date(),
      },
      {
        name: 'Abstract Creation #3',
        description:
          'An abstract digital creation representing the future of art',
        image_url: '/images/icon3.png',
        price: '0.8',
        token_id: '3',
        contract_address: '0x1234567890123456789012345678901234567890',
        owner_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      },
      {
        name: 'NFT Masterpiece #4',
        description: 'A masterpiece in the NFT collection',
        image_url: '/images/icon4.png',
        price: '2.5',
        token_id: '4',
        contract_address: '0x1234567890123456789012345678901234567890',
        owner_address: '0x8ba1f109551bD432803012645Hac136c22C177E9',
      },
      {
        name: 'Digital Wonder #5',
        description: 'A wonder of digital creation and innovation',
        image_url: '/images/splash.png',
        price: '0.3',
        token_id: '5',
        contract_address: '0x1234567890123456789012345678901234567890',
        owner_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      },
      {
        name: 'Rare Gem #6',
        description: 'An extremely rare NFT gem in the collection',
        image_url: '/images/icon1.png',
        price: '5.0',
        token_id: '6',
        contract_address: '0x1234567890123456789012345678901234567890',
        owner_address: '0x8ba1f109551bD432803012645Hac136c22C177E9',
      },
    ];

    const createdNFTs = await NFT.insertMany(sampleNFTs);
    logger.info(`✓ Created ${createdNFTs.length} sample NFTs`);

    logger.info('✅ Seeding completed successfully!');
    logger.info('📝 Test Credentials:');
    logger.info('   Admin: admin@dcuk.com / admin123');
    logger.info('   User:  user@dcuk.com / user123');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

seed();

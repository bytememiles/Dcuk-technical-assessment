/**
 * Database Configuration
 *
 * MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // Use MONGODB_URI if provided, otherwise use default local connection
    const mongoURI =
      process.env.MONGODB_URI || `mongodb://localhost:27017/dcuk-assessment`;

    const conn = await mongoose.connect(mongoURI);

    logger.info('MongoDB connected successfully', {
      host: conn.connection.host,
      database: conn.connection.name,
    });
  } catch (error) {
    logger.error('Database connection error:', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error:', {
    message: err.message,
    stack: err.stack,
  });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;

/**
 * Web3 Controller
 * Handles Web3 wallet verification
 */

const { ethers } = require('ethers');
const logger = require('../config/logger');
const User = require('../models/User');

/**
 * Verify wallet ownership
 */
exports.verifyOwnership = async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res
        .status(400)
        .json({ error: 'Wallet address, signature, and message required' });
    }

    // Verify signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      const verified =
        recoveredAddress.toLowerCase() === walletAddress.toLowerCase();

      if (verified) {
        // Update user's wallet address
        await User.findByIdAndUpdate(req.user.id, {
          wallet_address: walletAddress,
        });

        res.json({
          verified: true,
          walletAddress: walletAddress,
        });
      } else {
        res.status(400).json({
          verified: false,
          error: 'Signature verification failed',
        });
      }
    } catch (error) {
      logger.error('Signature verification error:', {
        message: error.message,
        stack: error.stack,
      });
      res.status(400).json({
        verified: false,
        error: 'Invalid signature',
      });
    }
  } catch (error) {
    logger.error('Verify ownership error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Verification failed' });
  }
};

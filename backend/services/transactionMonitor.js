/**
 * Transaction Monitoring Service
 * Monitors blockchain transactions and updates order status
 */

const { ethers } = require('ethers');
const Order = require('../models/Order');
const logger = require('../config/logger');

class TransactionMonitor {
  constructor() {
    this.provider = null;
    this.monitoringIntervals = new Map(); // Map of orderId -> intervalId
    this.maxConfirmations = 3; // Number of confirmations required
    this.checkInterval = 10000; // Check every 10 seconds
  }

  /**
   * Initialize provider
   */
  initialize(providerUrl) {
    if (providerUrl) {
      this.provider = new ethers.JsonRpcProvider(providerUrl);
    } else {
      // Default to public RPC (for demo purposes)
      // In production, use a reliable provider like Infura or Alchemy
      this.provider = new ethers.JsonRpcProvider(
        process.env.WEB3_PROVIDER_URL ||
          'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
      );
    }
  }

  /**
   * Start monitoring a transaction for an order
   */
  async startMonitoring(orderId, transactionHash) {
    if (!this.provider) {
      logger.error('Transaction monitor: Provider not initialized');
      return;
    }

    if (!transactionHash) {
      logger.error('Transaction monitor: No transaction hash provided');
      return;
    }

    // Stop any existing monitoring for this order
    this.stopMonitoring(orderId);

    logger.info(
      `Starting transaction monitoring for order ${orderId}, tx: ${transactionHash}`
    );

    const checkTransaction = async () => {
      try {
        const receipt =
          await this.provider.getTransactionReceipt(transactionHash);

        if (!receipt) {
          // Transaction not yet mined
          logger.debug(`Transaction ${transactionHash} not yet mined`);
          return;
        }

        // Transaction has been mined
        if (receipt.status === 1) {
          // Success
          const confirmations = await receipt.confirmations();
          logger.info(
            `Transaction ${transactionHash} confirmed ${confirmations} times`
          );

          if (confirmations >= this.maxConfirmations) {
            // Update order to completed
            await Order.findByIdAndUpdate(orderId, {
              status: 'completed',
              transaction_status: 'confirmed',
            });
            logger.info(`Order ${orderId} marked as completed`);
            this.stopMonitoring(orderId);
          } else {
            // Update to processing while waiting for confirmations
            await Order.findByIdAndUpdate(orderId, {
              status: 'processing',
              transaction_status: 'pending',
            });
          }
        } else {
          // Transaction failed
          await Order.findByIdAndUpdate(orderId, {
            status: 'failed',
            transaction_status: 'failed',
            failure_reason: 'Transaction reverted on-chain',
          });
          logger.warn(
            `Order ${orderId} marked as failed - transaction reverted`
          );
          this.stopMonitoring(orderId);
        }
      } catch (error) {
        logger.error(`Error monitoring transaction ${transactionHash}:`, {
          message: error.message,
          stack: error.stack,
        });

        // Check if transaction exists (might be pending)
        try {
          const tx = await this.provider.getTransaction(transactionHash);
          if (!tx) {
            // Transaction doesn't exist - might have been dropped
            await Order.findByIdAndUpdate(orderId, {
              status: 'failed',
              transaction_status: 'failed',
              failure_reason: 'Transaction not found on blockchain',
            });
            logger.warn(
              `Order ${orderId} marked as failed - transaction not found`
            );
            this.stopMonitoring(orderId);
          }
        } catch (txError) {
          logger.error(`Error checking transaction existence:`, {
            message: txError.message,
            stack: txError.stack,
          });
        }
      }
    };

    // Check immediately
    await checkTransaction();

    // Set up interval to check periodically
    const intervalId = setInterval(checkTransaction, this.checkInterval);
    this.monitoringIntervals.set(orderId.toString(), intervalId);

    // Set a timeout to stop monitoring after 30 minutes (transaction likely failed)
    setTimeout(
      () => {
        this.stopMonitoring(orderId);
        // Check final status
        Order.findById(orderId).then(order => {
          if (order && order.status === 'pending') {
            Order.findByIdAndUpdate(orderId, {
              status: 'failed',
              transaction_status: 'failed',
              failure_reason: 'Transaction monitoring timeout',
            });
          }
        });
      },
      30 * 60 * 1000
    ); // 30 minutes
  }

  /**
   * Stop monitoring a transaction
   */
  stopMonitoring(orderId) {
    const intervalId = this.monitoringIntervals.get(orderId.toString());
    if (intervalId) {
      clearInterval(intervalId);
      this.monitoringIntervals.delete(orderId.toString());
      logger.info(`Stopped monitoring order ${orderId}`);
    }
  }

  /**
   * Stop all monitoring
   */
  stopAll() {
    this.monitoringIntervals.forEach((intervalId, orderId) => {
      clearInterval(intervalId);
    });
    this.monitoringIntervals.clear();
  }
}

// Singleton instance
const transactionMonitor = new TransactionMonitor();

module.exports = transactionMonitor;

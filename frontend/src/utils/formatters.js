/**
 * Utility functions for formatting data
 */

/**
 * Format price to ETH with 3 decimal places
 */
export const formatPrice = price => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '0 ETH';
  return `${numPrice.toFixed(3)} ETH`;
};

/**
 * Truncate Ethereum address to show first 6 and last 4 characters
 */
export const truncateAddress = address => {
  if (!address) return 'N/A';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Navigation Bar Component - Mobile First Responsive with Drawer
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { account, connectWallet, isConnected } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const formatAddress = address => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-purple-600"
            onClick={() => setIsMenuOpen(false)}
          >
            NFT Market
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Marketplace
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Orders
                </Link>
                <span className="text-sm text-gray-700 truncate max-w-[120px]">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-gray-300 transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-purple-700 transition-colors text-sm"
                >
                  Register
                </Link>
              </>
            )}

            {isConnected ? (
              <span className="text-xs sm:text-sm text-gray-600 bg-green-100 px-2 sm:px-3 py-1 rounded">
                {formatAddress(account)}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-purple-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Drawer Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Drawer Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link
              to="/"
              className="text-xl font-bold text-purple-600"
              onClick={closeMenu}
            >
              NFT Market
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 text-gray-700 hover:text-purple-600 focus:outline-none"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/marketplace"
                className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 text-center"
                onClick={closeMenu}
              >
                Marketplace
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="relative text-gray-700 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    <span className="flex items-center justify-between">
                      Cart
                      {totalItems > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </span>
                  </Link>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Orders
                  </Link>
                  <div className="px-3 py-2 text-sm text-gray-700 border-t border-gray-200 pt-4 mt-2">
                    <p className="font-medium mb-1">Signed in as:</p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-left bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm mt-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 text-center"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm text-center"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                {isConnected ? (
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-500 mb-2">
                      Wallet Connected
                    </p>
                    <span className="text-xs text-gray-600 bg-green-100 px-3 py-2 rounded-lg inline-block">
                      {formatAddress(account)}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      closeMenu();
                    }}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

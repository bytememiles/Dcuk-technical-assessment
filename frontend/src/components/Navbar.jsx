/**
 * Navigation Bar Component
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { account, connectWallet, isConnected } = useWeb3();

  const handleLogout = () => {
    logout();
  };

  const formatAddress = address => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            NFT Market
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-purple-600"
            >
              Marketplace
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-purple-600"
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
                  className="text-gray-700 hover:text-purple-600"
                >
                  Orders
                </Link>
                <span className="text-gray-700">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Register
                </Link>
              </>
            )}

            {isConnected ? (
              <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded">
                {formatAddress(account)}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

/**
 * Main App Component
 */

import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import NFTDetail from './pages/NFTDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

// Navigation tracker component
const NavigationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    let history = [];

    try {
      const stored = sessionStorage.getItem('navigationHistory');
      if (stored) {
        history = JSON.parse(stored);
      }
    } catch (error) {
      history = [];
    }

    // Add current path to history if it's different from the last one
    if (history.length === 0 || history[history.length - 1] !== currentPath) {
      history.push(currentPath);
      // Keep only last 10 paths
      if (history.length > 10) {
        history = history.slice(-10);
      }
      sessionStorage.setItem('navigationHistory', JSON.stringify(history));
    }
  }, [location.pathname]);

  return null;
};

function App() {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

  // Log configuration for debugging
  useEffect(() => {
    if (privyAppId) {
      console.log('Privy App ID configured:', privyAppId);
      console.log('Current URL:', window.location.origin);
    } else {
      console.warn('Privy App ID is missing! Google OAuth will not work.');
    }
  }, [privyAppId]);

  if (!privyAppId) {
    console.warn(
      'VITE_PRIVY_APP_ID is not set. Please add it to your .env file.'
    );
  }

  return (
    <PrivyProvider
      appId={privyAppId || ''}
      config={{
        loginMethods: ['email', 'google'],
        appearance: {
          theme: 'light',
          accentColor: '#9333ea',
          logo: '/images/icon1.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // Configure OAuth redirect URLs
        legal: {
          termsAndConditionsUrl: undefined,
          privacyPolicyUrl: undefined,
        },
      }}
    >
      <Router>
        <NavigationTracker />
        <AuthProvider>
          <Web3Provider>
            <CartProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    {/* Public route - only accessible in guest mode */}
                    <Route path="/" element={<Home />} />

                    {/* Public routes - redirect to home if authenticated */}
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />

                    {/* Protected routes - require authentication */}
                    <Route
                      path="/marketplace"
                      element={
                        <PrivateRoute>
                          <Marketplace />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/nft/:id"
                      element={
                        <PrivateRoute>
                          <NFTDetail />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <PrivateRoute>
                          <Cart />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <PrivateRoute>
                          <Checkout />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <PrivateRoute>
                          <Orders />
                        </PrivateRoute>
                      }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </CartProvider>
          </Web3Provider>
        </AuthProvider>
      </Router>
    </PrivyProvider>
  );
}

export default App;

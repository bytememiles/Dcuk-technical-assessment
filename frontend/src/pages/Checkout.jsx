/**
 * Checkout Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { account, isConnected, connectWallet, verifyOwnership } = useWeb3();
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleVerifyOwnership = async () => {
    if (!isConnected) {
      const result = await connectWallet();
      if (!result.success) {
        alert('Failed to connect wallet');
        return;
      }
    }

    setVerifying(true);
    const result = await verifyOwnership();
    setVerifying(false);

    if (result.verified) {
      setVerified(true);
      alert('Wallet ownership verified!');
    } else {
      alert(result.error || 'Verification failed');
    }
  };

  const handlePlaceOrder = async () => {
    if (!verified) {
      alert('Please verify wallet ownership first');
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await axios.post('/api/orders', {
        transaction_hash: null // In real app, this would come from blockchain transaction
      });

      await clearCart();
      navigate(`/orders/${response.data.order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name} x{item.quantity}</span>
            <span>{(parseFloat(item.price) * item.quantity).toFixed(4)} ETH</span>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-purple-600">{totalPrice.toFixed(4)} ETH</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Verification</h2>
        {!isConnected ? (
          <div>
            <p className="text-gray-600 mb-4">
              Connect your wallet to verify ownership
            </p>
            <button
              onClick={connectWallet}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Connected: {account?.slice(0, 10)}...{account?.slice(-8)}
            </p>
            {!verified ? (
              <button
                onClick={handleVerifyOwnership}
                disabled={verifying}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Verify Ownership'}
              </button>
            ) : (
              <div className="text-green-600 font-semibold">
                ✓ Wallet verified
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={!verified || placingOrder}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {placingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;


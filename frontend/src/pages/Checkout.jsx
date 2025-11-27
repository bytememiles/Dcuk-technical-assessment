/**
 * Checkout Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/BackButton';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { account, isConnected, connectWallet, verifyOwnership, signer } =
    useWeb3();
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [verified, setVerified] = useState(false);

  // Calculate fees (2.5% platform fee)
  const subtotal = totalPrice;
  const fee = subtotal * 0.025;
  const finalTotal = subtotal + fee;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleVerifyOwnership = async () => {
    if (!isConnected) {
      const result = await connectWallet();
      if (!result.success) {
        toast.error('Failed to connect wallet');
        return;
      }
    }

    setVerifying(true);
    const result = await verifyOwnership();
    setVerifying(false);

    if (result.verified) {
      setVerified(true);
      toast.success('Wallet ownership verified!');
    } else {
      toast.error(result.error || 'Verification failed');
    }
  };

  const handlePlaceOrder = async () => {
    if (!verified) {
      toast.error('Please verify wallet ownership first');
      return;
    }

    if (!isConnected || !signer) {
      toast.error('Wallet not connected');
      return;
    }

    setPlacingOrder(true);
    try {
      // In a real application, this would interact with a smart contract
      // For this demo, we'll simulate a transaction by creating a signed message
      // that represents the order commitment
      const orderMessage = `Order: ${items.length} items, Total: ${finalTotal.toFixed(4)} ETH`;
      let transactionHash = null;

      try {
        // Simulate transaction: In production, this would be an actual contract call
        // For demo purposes, we'll create a transaction hash from a signed message
        const signature = await signer.signMessage(orderMessage);

        // In production, you would:
        // 1. Call a smart contract function to transfer funds
        // 2. Get the transaction hash from the contract call
        // 3. Wait for transaction confirmation
        // For now, we'll use a simulated hash based on the signature
        transactionHash = `0x${signature.slice(0, 64)}...`;

        toast.info('Transaction submitted. Processing order...');
      } catch (txError) {
        console.error('Transaction error:', txError);
        if (txError.code === 4001) {
          toast.error('Transaction rejected by user');
          setPlacingOrder(false);
          return;
        }
        throw txError;
      }

      // Create order with transaction hash
      const response = await axios.post('/api/orders', {
        transaction_hash: transactionHash,
      });

      await clearCart();
      toast.success(
        'Order placed successfully! Transaction is being processed.'
      );
      navigate(`/orders/${response.data.order._id || response.data.order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton defaultPath="/cart" className="mb-6" />
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {items.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>
              {(parseFloat(item.price) * item.quantity).toFixed(4)} ETH
            </span>
          </div>
        ))}
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(4)} ETH</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Platform Fee (2.5%):</span>
            <span>{fee.toFixed(4)} ETH</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-purple-600">{finalTotal.toFixed(4)} ETH</span>
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

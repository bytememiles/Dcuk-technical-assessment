/**
 * Cart Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { items, loading, removeFromCart, totalPrice } = useCart();
  const [removing, setRemoving] = useState({});

  const handleRemove = async itemId => {
    setRemoving({ ...removing, [itemId]: true });
    await removeFromCart(itemId);
    setRemoving({ ...removing, [itemId]: false });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/marketplace" className="text-purple-600 hover:underline">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4 mb-4 last:border-0"
          >
            <div className="flex items-center space-x-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">
                  Quantity: {item.quantity}
                </p>
                <p className="text-purple-600 font-bold">
                  {item.price} ETH each
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold">
                {(parseFloat(item.price) * item.quantity).toFixed(4)} ETH
              </p>
              <button
                onClick={() => handleRemove(item.id)}
                disabled={removing[item.id]}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {removing[item.id] ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-purple-600">
              {totalPrice.toFixed(4)} ETH
            </span>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

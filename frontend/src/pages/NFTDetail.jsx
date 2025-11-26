/**
 * NFT Detail Page
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const NFTDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchNFT();
  }, [id]);

  const fetchNFT = async () => {
    try {
      const response = await axios.get(`/api/nfts/${id}`);
      setNft(response.data.nft);
    } catch (error) {
      console.error('Failed to fetch NFT:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(nft.id);
    setAddingToCart(false);

    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!nft) {
    return <div className="text-center py-8">NFT not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {nft.image_url && (
              <img
                src={nft.image_url}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4">{nft.name}</h1>
            <p className="text-gray-600 mb-6">{nft.description}</p>

            <div className="mb-6">
              <p className="text-2xl font-bold text-purple-600 mb-2">
                {nft.price} ETH
              </p>
              {nft.token_id && (
                <p className="text-sm text-gray-500">
                  Token ID: {nft.token_id}
                </p>
              )}
              {nft.contract_address && (
                <p className="text-sm text-gray-500">
                  Contract: {nft.contract_address.slice(0, 10)}...
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;


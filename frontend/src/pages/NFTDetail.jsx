/**
 * NFT Detail Page - Enhanced with verification and related NFTs
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';
import NFTCard from '../components/NFTCard';
import BackButton from '../components/BackButton';
import { formatPrice, truncateAddress } from '../utils/formatters';

const NFTDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart, items } = useCart();
  const { account, signMessage, connectWallet, isConnected } = useWeb3();
  const [nft, setNft] = useState(null);
  const [relatedNFTs, setRelatedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(null);

  useEffect(() => {
    fetchNFT();
    fetchRelatedNFTs();
  }, [id]);

  const fetchNFT = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/nfts/${id}`);
      setNft(response.data.nft);
      // Check if current user is verified
      if (response.data.nft.verified_owners && account) {
        const isVerified = response.data.nft.verified_owners.some(
          v => v.address.toLowerCase() === account.toLowerCase()
        );
        if (isVerified) {
          setVerificationStatus({
            verified: true,
            message: 'Ownership verified',
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch NFT:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNFTs = async () => {
    try {
      const response = await axios.get(`/api/nfts/${id}/related`);
      setRelatedNFTs(response.data.relatedNFTs || []);
    } catch (error) {
      console.error('Failed to fetch related NFTs:', error);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleVerifyOwnership = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isConnected) {
      const result = await connectWallet();
      if (!result.success) {
        toast.error('Please connect your wallet to verify ownership');
        return;
      }
    }

    if (!nft.contract_address || !nft.token_id) {
      toast.error(
        'This NFT does not have contract information for verification'
      );
      return;
    }

    try {
      setVerifying(true);
      const message = `Verify ownership of NFT ${nft.name} (Token ID: ${nft.token_id})`;
      const signature = await signMessage(message);

      const response = await axios.post(`/api/nfts/${id}/verify-ownership`, {
        walletAddress: account,
        signature,
        message,
      });

      setVerificationStatus(response.data);
      if (response.data.verified) {
        toast.success('Ownership verified successfully!');
        // Refresh NFT data to get updated verification status
        await fetchNFT();
      } else {
        toast.error(response.data.message || 'Ownership verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.error || 'Verification failed';
      toast.error(errorMessage);
      setVerificationStatus({
        verified: false,
        error: errorMessage,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(nft._id || nft.id);
    setAddingToCart(false);

    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!nft) return;

    // Check if NFT is already in cart
    const nftId = String(nft._id || nft.id);
    const isInCart = items.some(item => String(item.nft_id) === nftId);

    // Only add to cart if not already there
    if (!isInCart) {
      setAddingToCart(true);
      const result = await addToCart(nftId);
      setAddingToCart(false);

      if (!result.success) {
        toast.error(result.error || 'Failed to add to cart');
        return;
      }
    }

    // Navigate to checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NFT details...</p>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">NFT not found</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="mt-4 text-purple-600 hover:text-purple-700 underline"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const isVerifiedOwner =
    verificationStatus?.verified &&
    nft.verified_owners?.some(
      v => v.address.toLowerCase() === account?.toLowerCase()
    );

  const isListedOwner =
    nft.owner_address &&
    account &&
    nft.owner_address.toLowerCase() === account.toLowerCase();

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      {/* Go Back Button */}
      <BackButton defaultPath="/marketplace" className="mb-4 sm:mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Image Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {nft.image_url ? (
            <img
              src={nft.image_url}
              alt={nft.name}
              className="w-full h-auto object-contain max-h-[600px] mx-auto"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold flex-1">
              {nft.name}
            </h1>
            {/* Verification Badge - Show only if ownership has been verified */}
            {nft.verified_owners &&
              Array.isArray(nft.verified_owners) &&
              nft.verified_owners.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              )}
          </div>

          <p className="text-gray-600 mb-6">
            {nft.description || 'No description'}
          </p>

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-purple-600 mb-4">
              {formatPrice(nft.price)}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-3 mb-6">
            {nft.token_id && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Token ID:
                </span>
                <span className="text-sm text-gray-600 font-mono">
                  {nft.token_id}
                </span>
              </div>
            )}

            {nft.contract_address && (
              <div className="py-2 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Contract Address:
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(nft.contract_address, 'contract')
                    }
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {copiedAddress === 'contract' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <span className="text-sm text-gray-600 font-mono break-all">
                  {nft.contract_address}
                </span>
              </div>
            )}

            {nft.owner_address && (
              <div className="py-2 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Listed Owner:
                  </span>
                  <button
                    onClick={() => copyToClipboard(nft.owner_address, 'owner')}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {copiedAddress === 'owner' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <span className="text-sm text-gray-600 font-mono break-all">
                  {nft.owner_address}
                </span>
              </div>
            )}

            {verificationStatus?.onChainOwner && (
              <div className="py-2 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    On-Chain Owner:
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        verificationStatus.onChainOwner,
                        'onchain'
                      )
                    }
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {copiedAddress === 'onchain' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <span className="text-sm text-gray-600 font-mono break-all">
                  {verificationStatus.onChainOwner}
                </span>
              </div>
            )}
          </div>

          {/* Verification Section */}
          {nft.contract_address && nft.token_id && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Ownership Verification
              </h3>

              {verificationStatus && (
                <div
                  className={`mb-3 p-3 rounded-lg ${
                    verificationStatus.verified
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {verificationStatus.verified ? (
                      <svg
                        className="w-5 h-5 text-green-600 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          verificationStatus.verified
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}
                      >
                        {verificationStatus.verified
                          ? verificationStatus.message ||
                            'Ownership verified on-chain'
                          : verificationStatus.error || 'Verification failed'}
                      </p>
                      {verificationStatus.verified && (
                        <div className="mt-2 space-y-1">
                          {isListedOwner && (
                            <p className="text-xs text-green-700">
                              ✓ You are the listed owner
                            </p>
                          )}
                          {verificationStatus.isListedOwner === false && (
                            <p className="text-xs text-yellow-700">
                              ⚠ On-chain owner differs from listed owner
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleVerifyOwnership}
                disabled={verifying || isVerifiedOwner}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {verifying
                  ? 'Verifying...'
                  : isVerifiedOwner
                    ? '✓ Ownership Verified'
                    : 'Verify Ownership'}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBuyNow}
              disabled={addingToCart}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
            >
              {addingToCart ? 'Adding...' : 'Buy Now'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Related NFTs */}
      {relatedNFTs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Related NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedNFTs.map(relatedNft => (
              <NFTCard
                key={relatedNft._id || relatedNft.id}
                nft={relatedNft}
                onAddToCart={(e, nftId) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  addToCart(nftId);
                }}
                isAddingToCart={false}
                formatPrice={formatPrice}
                truncateAddress={truncateAddress}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTDetail;

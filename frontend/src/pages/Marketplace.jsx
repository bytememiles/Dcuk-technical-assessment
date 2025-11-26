/**
 * Marketplace Page - Enhanced with filtering, sorting, and improved UI
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import MarketplaceFilters from '../components/MarketplaceFilters';
import NFTCard from '../components/NFTCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice, truncateAddress } from '../utils/formatters';

const Marketplace = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Filter input states (what user types)
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [ownerFilterInput, setOwnerFilterInput] = useState('');
  const [contractFilterInput, setContractFilterInput] = useState('');
  const [sortByInput, setSortByInput] = useState('date');
  const [sortOrderInput, setSortOrderInput] = useState('desc');

  // Applied filter states (what's actually used in API calls)
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [contractFilter, setContractFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const [addingToCart, setAddingToCart] = useState({});
  const [sortByOpen, setSortByOpen] = useState(false);
  const [sortOrderOpen, setSortOrderOpen] = useState(false);

  // Use ref to prevent duplicate API calls and cancel in-flight requests
  const abortControllerRef = useRef(null);

  // Memoize fetchNFTs to prevent unnecessary re-renders
  const fetchNFTs = useCallback(async () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        sortOrder,
      });

      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (ownerFilter) params.append('owner', ownerFilter);
      if (contractFilter) params.append('contract', contractFilter);

      const response = await axios.get(`/api/nfts?${params.toString()}`, {
        signal: abortController.signal,
      });

      // Only update state if request wasn't cancelled
      if (!abortController.signal.aborted) {
        setNfts(response.data.nfts || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      // Don't set error if request was cancelled
      if (error.name !== 'CanceledError' && !axios.isCancel(error)) {
        console.error('Failed to fetch NFTs:', error);
        setError('Failed to load NFTs. Please try again.');
      }
    } finally {
      // Only update loading state if request wasn't cancelled
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
      // Clear the ref if this was the current request
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [
    page,
    minPrice,
    maxPrice,
    ownerFilter,
    contractFilter,
    sortBy,
    sortOrder,
  ]);

  // Only trigger API call when page or applied filters change
  useEffect(() => {
    fetchNFTs();

    // Cleanup: cancel request if component unmounts or dependencies change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [fetchNFTs]);

  const handleApplyFilters = () => {
    // Apply the input values to the actual filter states
    setMinPrice(minPriceInput);
    setMaxPrice(maxPriceInput);
    setOwnerFilter(ownerFilterInput);
    setContractFilter(contractFilterInput);
    setSortBy(sortByInput);
    setSortOrder(sortOrderInput);
    setPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    // Clear input states
    setMinPriceInput('');
    setMaxPriceInput('');
    setOwnerFilterInput('');
    setContractFilterInput('');
    setSortByInput('date');
    setSortOrderInput('desc');

    // Clear applied filter states - React 18+ batches these automatically
    setMinPrice('');
    setMaxPrice('');
    setOwnerFilter('');
    setContractFilter('');
    setSortBy('date');
    setSortOrder('desc');
    setPage(1);
  };

  const handleAddToCart = async (e, nftId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [nftId]: true }));
    const result = await addToCart(nftId);
    setAddingToCart(prev => ({ ...prev, [nftId]: false }));

    if (result.success) {
      // Show success feedback (you could use a toast library here)
      console.log('Added to cart');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const hasActiveFilters =
    minPrice ||
    maxPrice ||
    ownerFilter ||
    contractFilter ||
    sortBy !== 'date' ||
    sortOrder !== 'desc';

  const hasFilterInputs =
    minPriceInput ||
    maxPriceInput ||
    ownerFilterInput ||
    contractFilterInput ||
    sortByInput !== 'date' ||
    sortOrderInput !== 'desc';

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Marketplace</h1>

      {/* Filters Section */}
      <MarketplaceFilters
        minPriceInput={minPriceInput}
        maxPriceInput={maxPriceInput}
        ownerFilterInput={ownerFilterInput}
        contractFilterInput={contractFilterInput}
        sortByInput={sortByInput}
        sortOrderInput={sortOrderInput}
        onMinPriceChange={setMinPriceInput}
        onMaxPriceChange={setMaxPriceInput}
        onOwnerFilterChange={setOwnerFilterInput}
        onContractFilterChange={setContractFilterInput}
        onSortByChange={setSortByInput}
        onSortOrderChange={setSortOrderInput}
        sortByOpen={sortByOpen}
        sortOrderOpen={sortOrderOpen}
        onSortByToggle={setSortByOpen}
        onSortOrderToggle={setSortOrderOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        hasFilterInputs={hasFilterInputs}
        loading={loading}
      />

      {/* Error State */}
      <ErrorMessage message={error} onRetry={fetchNFTs} />

      {/* Loading State */}
      {loading && nfts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map(nft => (
              <NFTCard
                key={nft._id || nft.id}
                nft={nft}
                onAddToCart={handleAddToCart}
                isAddingToCart={addingToCart[nft._id || nft.id]}
                formatPrice={formatPrice}
                truncateAddress={truncateAddress}
              />
            ))}
          </div>

          {/* Empty State */}
          {nfts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No NFTs found</p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Clear filters to see all NFTs
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={pagination?.totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default Marketplace;

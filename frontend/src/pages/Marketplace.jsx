/**
 * Marketplace Page
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      searchNFTs();
    } else {
      fetchNFTs();
    }
  }, [page, searchQuery]);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/nfts?page=${page}&limit=12`);
      setNfts(response.data.nfts || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchNFTs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/nfts/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=12`
      );
      setNfts(response.data.nfts || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (searchQuery) {
      searchNFTs();
    } else {
      fetchNFTs();
    }
  };

  if (loading && nfts.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Marketplace</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NFTs..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <Link
            key={nft.id}
            to={`/nft/${nft.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {nft.image_url && (
              <img
                src={nft.image_url}
                alt={nft.name}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{nft.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {nft.description}
              </p>
              <p className="text-purple-600 font-bold">
                {nft.price} ETH
              </p>
            </div>
          </Link>
        ))}
      </div>

      {nfts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No NFTs found
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;


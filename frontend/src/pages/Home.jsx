/**
 * Home Page
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredNFTs, setFeaturedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNFTs();
  }, []);

  const fetchFeaturedNFTs = async () => {
    try {
      const response = await axios.get('/api/nfts?limit=6');
      setFeaturedNFTs(response.data.nfts || []);
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome to NFT Market</h1>
      <p className="text-gray-600 mb-8">
        Discover and collect unique digital assets
      </p>

      <h2 className="text-2xl font-semibold mb-4">Featured NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredNFTs.map(nft => (
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
              <p className="text-purple-600 font-bold">{nft.price} ETH</p>
            </div>
          </Link>
        ))}
      </div>

      {featuredNFTs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No NFTs available yet
        </div>
      )}
    </div>
  );
};

export default Home;

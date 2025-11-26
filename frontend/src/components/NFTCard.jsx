/**
 * NFT Card Component
 * Displays a single NFT card with image, details, and actions
 */

import { Link } from 'react-router-dom';

const NFTCard = ({
  nft,
  onAddToCart,
  isAddingToCart,
  formatPrice,
  truncateAddress,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
      <Link to={`/nft/${nft._id || nft.id}`} className="block">
        {nft.image_url ? (
          <img
            src={nft.image_url}
            alt={nft.name}
            className="w-full h-64 object-cover"
            onError={e => {
              e.target.src = '/images/icon1.png';
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/nft/${nft._id || nft.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 transition-colors">
            {nft.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {nft.description || 'No description'}
        </p>

        <div className="mb-3">
          <p className="text-purple-600 font-bold text-lg">
            {formatPrice(nft.price)}
          </p>
          {nft.owner_address && (
            <p className="text-xs text-gray-500 mt-1">
              Owner: {truncateAddress(nft.owner_address)}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/nft/${nft._id || nft.id}`}
            className="flex-1 text-center px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm"
          >
            View Details
          </Link>
          <button
            onClick={e => onAddToCart(e, nft._id || nft.id)}
            disabled={isAddingToCart}
            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;

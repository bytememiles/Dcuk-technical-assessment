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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
      <Link to={`/nft/${nft._id || nft.id}`} className="block flex-shrink-0">
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
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/nft/${nft._id || nft.id}`} className="flex-1">
            <h3 className="font-semibold text-lg hover:text-purple-600 transition-colors">
              {nft.name}
            </h3>
          </Link>
          {/* Verification Badge */}
          {nft.contract_address && nft.token_id && (
            <span
              className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
              title="Verified on-chain NFT"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {nft.description || 'No description'}
        </p>

        <div className="mt-auto">
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
    </div>
  );
};

export default NFTCard;

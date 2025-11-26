/**
 * Marketplace Filters Component
 * Filter inputs and controls for the marketplace
 */

import CustomDropdown from './CustomDropdown';

const MarketplaceFilters = ({
  // Filter input values
  minPriceInput,
  maxPriceInput,
  ownerFilterInput,
  contractFilterInput,
  sortByInput,
  sortOrderInput,
  // Filter input handlers
  onMinPriceChange,
  onMaxPriceChange,
  onOwnerFilterChange,
  onContractFilterChange,
  onSortByChange,
  onSortOrderChange,
  // Dropdown states
  sortByOpen,
  sortOrderOpen,
  onSortByToggle,
  onSortOrderToggle,
  // Actions
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
  hasFilterInputs,
  loading,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={minPriceInput}
            onChange={e => onMinPriceChange(e.target.value)}
            placeholder="0.0"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={maxPriceInput}
            onChange={e => onMaxPriceChange(e.target.value)}
            placeholder="10.0"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Owner Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner Address
          </label>
          <input
            type="text"
            value={ownerFilterInput}
            onChange={e => onOwnerFilterChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Contract Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract Address
          </label>
          <input
            type="text"
            value={contractFilterInput}
            onChange={e => onContractFilterChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
            Sort by:
          </label>
          <CustomDropdown
            value={sortByInput}
            onChange={onSortByChange}
            options={[
              { value: 'date', label: 'Date' },
              { value: 'price', label: 'Price' },
              { value: 'name', label: 'Name' },
            ]}
            isOpen={sortByOpen}
            onToggle={onSortByToggle}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
            Order:
          </label>
          <CustomDropdown
            value={sortOrderInput}
            onChange={onSortOrderChange}
            options={[
              { value: 'desc', label: 'Descending' },
              { value: 'asc', label: 'Ascending' },
            ]}
            isOpen={sortOrderOpen}
            onToggle={onSortOrderToggle}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
          <button
            onClick={onApplyFilters}
            disabled={loading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Apply Filters
          </button>
          {(hasActiveFilters || hasFilterInputs) && (
            <button
              onClick={onClearFilters}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;

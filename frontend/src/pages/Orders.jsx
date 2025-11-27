/**
 * Orders Page - Enhanced with filtering and sorting
 * Uses the same pattern as Marketplace page
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import BackButton from '../components/BackButton';
import CustomDropdown from '../components/CustomDropdown';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Filter input states (what user types/selects)
  const [statusInput, setStatusInput] = useState('all');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [sortByInput, setSortByInput] = useState('createdAt');
  const [sortOrderInput, setSortOrderInput] = useState('desc');

  // Applied filter states (what's actually used in API calls)
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [sortByOpen, setSortByOpen] = useState(false);
  const [sortOrderOpen, setSortOrderOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Use ref to prevent duplicate API calls and cancel in-flight requests
  const abortControllerRef = useRef(null);

  // Memoize fetchOrders to prevent unnecessary re-renders
  const fetchOrders = useCallback(async () => {
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
        limit: '10',
        sortBy,
        sortOrder,
      });

      if (status) params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`/api/orders?${params.toString()}`, {
        signal: abortController.signal,
      });

      // Only update state if request wasn't cancelled
      if (!abortController.signal.aborted) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      // Don't set error if request was cancelled
      if (error.name !== 'CanceledError' && !axios.isCancel(error)) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load orders. Please try again.');
        toast.error('Failed to fetch orders');
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
  }, [page, status, startDate, endDate, sortBy, sortOrder]);

  // Fetch orders when applied filters or page changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleApplyFilters = () => {
    setStatus(statusInput === 'all' ? '' : statusInput);
    setStartDate(startDateInput);
    setEndDate(endDateInput);
    setSortBy(sortByInput);
    setSortOrder(sortOrderInput);
    setPage(1); // Reset to first page
  };

  const handleClearFilters = () => {
    setStatusInput('all');
    setStartDateInput('');
    setEndDateInput('');
    setSortByInput('createdAt');
    setSortOrderInput('desc');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const hasActiveFilters = status || startDate || endDate;
  const hasFilterInputs =
    statusInput !== 'all' || startDateInput || endDateInput;

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton defaultPath="/marketplace" className="mb-6" />
        <div className="text-center py-8">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BackButton defaultPath="/marketplace" className="mb-6" />
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <CustomDropdown
              value={statusInput}
              onChange={value => setStatusInput(value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              isOpen={statusOpen}
              onToggle={setStatusOpen}
              className="w-full"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDateInput}
              onChange={e => setStartDateInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDateInput}
              onChange={e => setEndDateInput(e.target.value)}
              min={startDateInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <CustomDropdown
              value={sortByInput}
              onChange={value => setSortByInput(value)}
              options={[
                { value: 'createdAt', label: 'Date' },
                { value: 'total_amount', label: 'Amount' },
                { value: 'status', label: 'Status' },
                { value: 'order_number', label: 'Order #' },
              ]}
              isOpen={sortByOpen}
              onToggle={setSortByOpen}
              className="w-full"
            />
          </div>
        </div>

        {/* Sort Order and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              Order:
            </label>
            <CustomDropdown
              value={sortOrderInput}
              onChange={value => setSortOrderInput(value)}
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' },
              ]}
              isOpen={sortOrderOpen}
              onToggle={setSortOrderOpen}
              className="w-full sm:w-auto"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Apply Filters
            </button>
            {(hasActiveFilters || hasFilterInputs) && (
              <button
                onClick={handleClearFilters}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError(null);
            fetchOrders();
          }}
        />
      )}

      {/* Orders List */}
      {!error && orders.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No orders found</p>
          {hasActiveFilters ? (
            <button
              onClick={handleClearFilters}
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Clear filters to see all orders
            </button>
          ) : (
            <Link to="/marketplace" className="text-purple-600 hover:underline">
              Browse Marketplace
            </Link>
          )}
        </div>
      ) : (
        !error && (
          <>
            <div className="space-y-4 mb-6">
              {orders.map(order => (
                <Link
                  key={order._id || order.id}
                  to={`/orders/${order._id || order.id}`}
                  className="block bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <p className="font-semibold text-lg">
                          Order #{order.order_number || order._id || order.id}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {formatDate(order.createdAt || order.created_at)}
                      </p>
                      {order.transaction_hash && (
                        <p className="text-xs text-gray-500 mt-1">
                          TX: {order.transaction_hash.slice(0, 10)}...
                          {order.transaction_hash.slice(-8)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600 mb-1">
                        {parseFloat(order.total_amount).toFixed(4)} ETH
                      </p>
                      {order.fee && parseFloat(order.fee) > 0 && (
                        <p className="text-xs text-gray-500">
                          Fee: {parseFloat(order.fee).toFixed(4)} ETH
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.pages}
                onPageChange={setPage}
                loading={loading}
              />
            )}
          </>
        )
      )}
    </div>
  );
};

export default Orders;

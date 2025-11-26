/**
 * Error Message Component
 * Displays error messages with retry functionality
 */

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

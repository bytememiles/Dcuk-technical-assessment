/**
 * Back Button Component
 * Shows a back button only if user navigated to the page (not direct access)
 * Uses sessionStorage to track navigation within the SPA
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BackButton = ({ defaultPath = '/marketplace', className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    let history = [];

    // Get existing history
    try {
      const stored = sessionStorage.getItem('navigationHistory');
      if (stored) {
        history = JSON.parse(stored);
      }
    } catch (error) {
      history = [];
    }

    // Check if there's a previous path (user navigated here)
    // The last item in history might be the current path (if NavigationTracker updated first)
    // or the previous path (if BackButton checks first)
    const lastPath = history.length > 0 ? history[history.length - 1] : null;
    const secondLastPath =
      history.length > 1 ? history[history.length - 2] : null;

    // Determine previous path:
    // - If last path is different from current, it's the previous page
    // - If last path is same as current, check second-to-last
    const previousPath = lastPath !== currentPath ? lastPath : secondLastPath;

    // If previous path exists and is different from current, user navigated here
    if (previousPath && previousPath !== currentPath) {
      setCanGoBack(true);
    } else if (history.length > 1 && lastPath === currentPath) {
      // History has multiple entries and current is already in history, user has been navigating
      setCanGoBack(true);
    } else {
      // Check document.referrer as fallback
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;
      const currentUrl = window.location.href;

      if (
        referrer &&
        referrer.startsWith(currentOrigin) &&
        referrer !== currentUrl &&
        !referrer.includes(currentPath) // Make sure referrer is different page
      ) {
        setCanGoBack(true);
      } else {
        // No navigation history and no referrer - likely direct access
        setCanGoBack(false);
      }
    }

    // Update history with current path (after checking, so we check previous path correctly)
    if (history.length === 0 || history[history.length - 1] !== currentPath) {
      history.push(currentPath);
      // Keep only last 10 paths to avoid storage bloat
      if (history.length > 10) {
        history = history.slice(-10);
      }
      sessionStorage.setItem('navigationHistory', JSON.stringify(history));
    }
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Don't show if user accessed page directly
  if (!canGoBack) {
    return null;
  }

  return (
    <button
      onClick={handleGoBack}
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="font-medium">Back</span>
    </button>
  );
};

export default BackButton;

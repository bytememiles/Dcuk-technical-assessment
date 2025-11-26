/**
 * Login Page - Using Privy SSO
 */

import { useNavigate } from 'react-router-dom';
import { usePrivy, useLoginWithOAuth } from '@privy-io/react-auth';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, ready } = usePrivy();
  const { initOAuth, state: oauthState } = useLoginWithOAuth({
    onComplete: ({ user, isNewUser }) => {
      console.log('OAuth login successful:', { user, isNewUser });
    },
    onError: error => {
      console.error('OAuth login error:', error);
      alert(`OAuth login failed: ${error.message || 'Unknown error'}`);
    },
  });
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleEmailLogin = async () => {
    try {
      // This will open Privy's modal with email login
      console.log('Opening Privy email login modal...');
      await login();
    } catch (error) {
      console.error('Email login error:', error);
      alert(
        `Login error: ${error.message || 'Unknown error'}. Please check the browser console for details.`
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Use Privy's OAuth hook for Google login
      console.log('Initiating Google OAuth...');
      await initOAuth({ provider: 'google' });
    } catch (error) {
      console.error('Google OAuth error:', error);
      alert(
        `Google login error: ${error.message || 'Unknown error'}. Please check the browser console for details.`
      );
    }
  };

  if (!ready) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isLoading = oauthState.status === 'loading';

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6 text-center">
          Sign in with your email or Google account
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || !ready}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={handleEmailLogin}
            disabled={isLoading || !ready}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with Email
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          By signing in, you agree to our terms of service
        </p>
      </div>
    </div>
  );
};

export default Login;

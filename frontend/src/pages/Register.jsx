/**
 * Register Page - Using Privy SSO
 * Registration is handled through Privy login
 */

import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login, ready } = usePrivy();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSignUp = async () => {
    try {
      // This will open Privy's modal with all configured login methods
      console.log('Opening Privy sign up modal...');
      await login();
    } catch (error) {
      console.error('Sign up error:', error);
      alert(
        `Sign up error: ${error.message || 'Unknown error'}. Please check the browser console for details.`
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

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6 text-center">
          Create an account using your email or Google account. Your account
          will be created automatically when you sign in for the first time.
        </p>

        <button
          onClick={handleSignUp}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Sign Up
        </button>

        <p className="mt-3 text-center text-sm text-gray-600">
          You can sign up with Email or Google
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          By signing up, you agree to our terms of service
        </p>
      </div>
    </div>
  );
};

export default Register;

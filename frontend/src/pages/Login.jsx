/**
 * Login Page - Using Privy SSO
 */

import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, ready } = usePrivy();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
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
      <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6 text-center">
          Sign in with your email or Google account
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Sign In with Privy
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          By signing in, you agree to our terms of service
        </p>
      </div>
    </div>
  );
};

export default Login;

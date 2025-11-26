import { createContext, useContext, useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const {
    ready,
    authenticated,
    user: privyUser,
    login,
    logout: privyLogout,
    getAccessToken,
  } = usePrivy();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Handle Privy authentication
  useEffect(() => {
    const handlePrivyAuth = async () => {
      if (!ready) {
        setLoading(true);
        return;
      }

      if (authenticated && privyUser) {
        try {
          // Get Privy access token
          const accessToken = await getAccessToken();

          // Verify with backend and get JWT
          const response = await axios.post('/api/auth/privy/verify', {
            accessToken,
          });

          const { token: jwtToken, user: userData } = response.data;
          setToken(jwtToken);
          setUser(userData);
          localStorage.setItem('token', jwtToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        } catch (error) {
          console.error('Failed to verify Privy token:', error);
          // If verification fails, logout from Privy
          privyLogout();
        }
      } else {
        // Not authenticated, clear user state
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }

      setLoading(false);
    };

    handlePrivyAuth();
  }, [ready, authenticated, privyUser, getAccessToken, privyLogout]);

  // Fetch user data if token exists but user is not set
  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          logout();
        }
      }
    };

    if (ready && !authenticated) {
      fetchUser();
    }
  }, [token, user, ready, authenticated]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    privyLogout();
  };

  // Legacy methods for backward compatibility (not used with Privy)
  const loginWithPassword = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const registerWithPassword = async (email, password, walletAddress) => {
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        walletAddress,
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };

  const value = {
    user,
    loading: loading || !ready,
    login: handleLogin,
    logout,
    isAuthenticated: !!user || authenticated,
    // Legacy methods (kept for backward compatibility)
    loginWithPassword,
    registerWithPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

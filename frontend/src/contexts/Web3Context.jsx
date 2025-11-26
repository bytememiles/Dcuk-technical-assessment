import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (window.ethereum) {
      checkConnection();
      setupEventListeners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Disconnect wallet when user logs out
  useEffect(() => {
    if (!isAuthenticated && account) {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, account]);

  const checkConnection = async () => {
    // Only auto-connect if user is authenticated
    if (!isAuthenticated) {
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const setupEventListeners = () => {
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        connectWallet();
      }
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return { success: false, error: 'MetaMask not installed' };
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);

      return { success: true, address };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect wallet',
      };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
  };

  const signMessage = async message => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }
    return await signer.signMessage(message);
  };

  const verifyOwnership = async () => {
    if (!account || !isAuthenticated) {
      return {
        success: false,
        error: 'Wallet not connected or user not authenticated',
      };
    }

    try {
      const message = `Verify ownership of ${account}`;
      const signature = await signMessage(message);

      const response = await axios.post('/api/web3/verify-ownership', {
        walletAddress: account,
        signature,
        message,
      });

      return response.data;
    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Verification failed',
      };
    }
  };

  const value = {
    account,
    provider,
    signer,
    isConnecting,
    isConnected: !!account,
    connectWallet,
    disconnect,
    signMessage,
    verifyOwnership,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

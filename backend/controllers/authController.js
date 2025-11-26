/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrivyClient } = require('@privy-io/server-auth');
const User = require('../models/User');

// Initialize Privy client
let privy;
try {
  privy = new PrivyClient(
    process.env.PRIVY_APP_ID,
    process.env.PRIVY_APP_SECRET
  );
} catch (error) {
  console.error('Failed to initialize Privy client:', error);
  console.warn(
    'Privy authentication will not work without PRIVY_APP_ID and PRIVY_APP_SECRET'
  );
}

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, walletAddress } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password_hash: passwordHash,
      wallet_address: walletAddress || null,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        walletAddress: user.wallet_address,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        walletAddress: user.wallet_address,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Get current user
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

/**
 * Verify Privy access token and create/update user
 */
exports.verifyPrivy = async (req, res) => {
  try {
    if (!privy) {
      return res.status(500).json({
        error:
          'Privy is not configured. Please set PRIVY_APP_ID and PRIVY_APP_SECRET',
      });
    }

    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }

    // Verify the Privy access token
    let privyUser;
    try {
      console.log('Verifying Privy access token...');
      privyUser = await privy.verifyAuthToken(accessToken);
      console.log('Privy user verified:', {
        id: privyUser.id,
        email: privyUser.email?.address,
        linkedAccounts: privyUser.linkedAccounts?.map(acc => ({
          type: acc.type,
          email: acc.email || acc.address,
          address: acc.address,
        })),
      });
    } catch (error) {
      console.error('Privy verification error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        accessTokenLength: accessToken?.length,
      });
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }

    // Extract user information from Privy
    const privyUserId = privyUser.id;
    const linkedAccounts = privyUser.linkedAccounts || [];

    // Find email from various sources
    let email = privyUser.email?.address || null;

    // If no email from main object, try to get it from linked accounts
    if (!email) {
      const emailAccount = linkedAccounts.find(acc => acc.type === 'email');
      if (emailAccount) {
        email = emailAccount.address || emailAccount.email || null;
      }
    }

    // Try to get email from Google account if available
    if (!email) {
      const googleAccount = linkedAccounts.find(
        acc => acc.type === 'google_oauth'
      );
      if (googleAccount) {
        email = googleAccount.email || googleAccount.address || null;
      }
    }

    // Determine auth method
    let authMethod = 'privy_email';
    const googleAccount = linkedAccounts.find(
      acc => acc.type === 'google_oauth'
    );
    const walletAccount = linkedAccounts.find(acc => acc.type === 'wallet');

    if (googleAccount) {
      authMethod = 'privy_google';
    } else if (walletAccount) {
      authMethod = 'privy_wallet';
    }

    if (!email) {
      console.error('No email found in Privy user:', {
        privyUserId,
        linkedAccounts: linkedAccounts.map(acc => ({
          type: acc.type,
          email: acc.email || acc.address,
        })),
      });
      return res
        .status(400)
        .json({ error: 'Email is required for authentication' });
    }

    // Find or create user
    let user = await User.findOne({ privy_user_id: privyUserId });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Update existing user with Privy info
        existingUser.privy_user_id = privyUserId;
        existingUser.auth_method = authMethod;
        user = await existingUser.save();
      } else {
        // Create new user
        user = await User.create({
          email,
          privy_user_id: privyUserId,
          auth_method: authMethod,
          password_hash: null, // No password for Privy users
        });
      }
    } else {
      // Update auth method if changed
      if (user.auth_method !== authMethod) {
        user.auth_method = authMethod;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        walletAddress: user.wallet_address,
        authMethod: user.auth_method,
      },
    });
  } catch (error) {
    console.error('Privy verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

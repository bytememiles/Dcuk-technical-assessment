# Environment Variables Setup

## Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace placeholder values with your actual credentials.

## Manual Setup

Alternatively, create a `.env` file in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# Option 1: Docker Container (Recommended for development)
MONGODB_URI=mongodb://localhost:27017/dcuk-assessment

# Option 2: Local MongoDB Installation
# MONGODB_URI=mongodb://localhost:27017/dcuk-assessment

# Option 3: MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dcuk-assessment?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3012

# Web3 Configuration (optional, for transaction monitoring and NFT verification)
WEB3_PROVIDER_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
# Alternative: https://rpc.sepolia.org (public, rate-limited)
# Alternative: https://eth.llamarpc.com (public)

# Ethereum RPC URL (optional, fallback for NFT verification)
ETH_RPC_URL=https://eth.llamarpc.com

# Privy Configuration (for SSO authentication)
PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here
```

## Instructions

### Using Docker (Recommended)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Start MongoDB container:
   ```bash
   docker compose up -d mongodb
   ```

3. Verify MongoDB is running:
   ```bash
   docker ps
   ```

4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Edit `.env` and replace placeholder values with your actual credentials
6. The connection string `mongodb://localhost:27017/dcuk-assessment` will work with Docker

### Using Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and configure your MongoDB connection string

### Setup Steps (Alternative Method)

If you prefer to create `.env` manually instead of using `.env.example`:

1. Create a new file named `.env` in the `backend/` directory
2. Copy the content from the "Manual Setup" section above
3. Paste the content
4. Replace the placeholder values:
   - `MONGODB_URI` - Your MongoDB connection string
     - Docker: `mongodb://localhost:27017/dcuk-assessment`
     - Local: `mongodb://localhost:27017/dcuk-assessment`
     - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/dcuk-assessment`
   - `JWT_SECRET` - A random secret string (use a strong random string)
   - `WEB3_PROVIDER_URL` - Your Web3 RPC provider URL (optional)
     - Infura: `https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID`
     - Public: `https://rpc.sepolia.org` or `https://eth.llamarpc.com`
   - `PRIVY_APP_ID` and `PRIVY_APP_SECRET` - Get these from https://dashboard.privy.io after creating an account

## Quick Setup

### With Docker

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Start MongoDB:
   ```bash
   docker compose up -d mongodb
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and replace placeholder values:
   - Replace `your_privy_app_id_here` with your Privy App ID
   - Replace `your_privy_app_secret_here` with your Privy App Secret
   - Replace `your_super_secret_jwt_key_change_in_production` with a strong random string
   - Optionally configure `WEB3_PROVIDER_URL` for transaction monitoring

5. Stop MongoDB container when done:
   ```bash
   docker compose down
   ```

### With Local MongoDB

For local development with MongoDB installed locally, use the same `.env` configuration above.

## Privy Setup

1. Create a free account at https://privy.io
2. Create a new app in the Privy dashboard
3. Enable authentication methods:
   - Email (magic link)
   - Google OAuth
4. **CRITICAL - Configure Allowed Origins (Fixes "Origin not allowed" error):**
   - Go to your Privy app dashboard: https://dashboard.privy.io
   - Navigate to your app → **"Settings"** → **"Redirect URLs"** or **"Allowed Origins"**
   - Add the following origins (these are different from redirect URLs):
     - `http://localhost:3012` (without trailing slash)
     - `http://localhost:3012/` (with trailing slash - try both)
   - **Also check "OAuth Settings" or "OAuth Origins":**
     - Some Privy dashboards have a separate section for OAuth origins
     - Make sure `http://localhost:3012` is listed there too
5. **Configure Redirect URLs:**
   - In "Settings" → "Redirect URLs", add:
     - `http://localhost:3012`
     - `http://localhost:3012/`
     - `http://localhost:3012/login`
     - `http://localhost:3012/register`
6. **For Google OAuth specifically:**
   - Go to "Login Methods" → "Google"
   - Ensure "Google OAuth" is enabled
   - Verify all URLs match exactly
7. Copy your App ID and App Secret to the `.env` file:
   - `PRIVY_APP_ID` - Your Privy App ID
   - `PRIVY_APP_SECRET` - Your Privy App Secret

### Troubleshooting Google OAuth

If the Google button in the Privy modal doesn't work:

1. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for CORS, popup blocker, or OAuth errors

2. **Verify Redirect URLs:**
   - Must match exactly in Privy dashboard
   - Include protocol (`http://` or `https://`)
   - Include port number if using non-standard port
   - Try with and without trailing slash

3. **Check Popup Blockers:**
   - Disable popup blockers for localhost
   - Try in incognito mode
   - Ensure the click is a direct user action

4. **Verify Google OAuth is Enabled:**
   - In Privy dashboard: Settings → Login Methods
   - Ensure "Google" is toggled ON
   - Check that OAuth credentials are configured

5. **Test in Different Browsers:**
   - Some browsers block OAuth popups more aggressively
   - Try Chrome, Firefox, or Edge

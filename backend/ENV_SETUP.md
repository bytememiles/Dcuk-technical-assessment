# Environment Variables Setup

Create a `.env` file in the `backend/` directory with the following content:

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

# Web3
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# Or use: https://rpc.sepolia.org (public, rate-limited)

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

4. Create `.env` file in the `backend/` directory with the content above
5. The connection string `mongodb://localhost:27017/dcuk-assessment` will work with Docker

### Using Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Create `.env` file with the connection string

### Setup Steps

1. Copy the content above
2. Create a new file named `.env` in the `backend/` directory
3. Paste the content
4. Replace the placeholder values:
   - `MONGODB_URI` - Your MongoDB connection string
     - Local: `mongodb://localhost:27017/dcuk-assessment`
     - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/dcuk-assessment`
   - `your_super_secret_jwt_key_change_in_production` - A random secret string (use a strong random string)
   - `YOUR_INFURA_KEY` - Your Infura API key (optional, for Web3 RPC)
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

3. Create `.env` file in `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dcuk-assessment
JWT_SECRET=dev_secret_key_12345
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3012
PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here
```

4. Stop MongoDB container when done:
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
7. Copy your App ID and App Secret to the `.env` file

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

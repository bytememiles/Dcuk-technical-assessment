# Environment Variables Setup

Create a `.env` file in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection (Local)
MONGODB_URI=mongodb://localhost:27017/dcuk-assessment

# Alternative: MongoDB Atlas (cloud)
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

For local development with MongoDB installed locally:

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

## Privy Setup

1. Create a free account at https://privy.io
2. Create a new app in the Privy dashboard
3. Enable authentication methods:
   - Email (magic link)
   - Google OAuth
4. Configure redirect URLs:
   - Development: `http://localhost:3012`
   - Add your production URL when deploying
5. Copy your App ID and App Secret to the `.env` file

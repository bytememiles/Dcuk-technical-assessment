# Backend API - NFT E-Commerce Platform

## 📋 Overview

Express.js REST API for the NFT E-Commerce Platform with Web3 integration, Privy SSO authentication, and blockchain transaction monitoring.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure all required variables (see [ENV_SETUP.md](./ENV_SETUP.md) for details)

3. Start MongoDB (Docker):
   ```bash
   docker compose up -d mongodb
   ```

4. Initialize database:
   ```bash
   npm run migrate
   npm run seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── config/           # Configuration files (database, etc.)
├── controllers/      # Route controllers
├── middleware/       # Express middleware (auth, validation)
├── models/           # Mongoose models
├── routes/           # API routes
├── scripts/          # Database migration and seeding
├── services/         # Business logic services (transaction monitor)
├── docker-compose.yml # MongoDB container configuration
├── server.js         # Express app entry point
└── package.json      # Dependencies and scripts
```

## 🔧 Environment Variables

See [ENV_SETUP.md](./ENV_SETUP.md) for complete configuration guide.

Required variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `FRONTEND_URL` - Frontend URL for CORS
- `PRIVY_APP_ID` - Privy application ID
- `PRIVY_APP_SECRET` - Privy application secret
- `WEB3_PROVIDER_URL` - Web3 RPC provider URL (optional)
- `ETH_RPC_URL` - Ethereum RPC URL (optional, for NFT verification)

## 🗄️ Database Setup

### Option 1: Docker (Recommended)

```bash
# Start MongoDB container
docker compose up -d mongodb

# Verify it's running
docker ps

# Stop when done
docker compose down
```

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/dcuk-assessment`

### Option 3: MongoDB Atlas (Cloud)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Use: `mongodb+srv://username:password@cluster.mongodb.net/dcuk-assessment`

## 📊 Database Scripts

### Migration (Create Indexes)

```bash
npm run migrate
```

Creates indexes for:
- User model (email, privy_user_id)
- NFT model (price, owner_address, contract_address)
- Order model (user_id, status, order_number)
- CartItem model (user_id, nft_id)

### Seed (Sample Data)

```bash
npm run seed
```

Populates database with:
- Sample users (admin and regular user)
- Sample NFTs with metadata

## 🏃 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/privy/verify` - Verify Privy access token and create/update user
- `POST /api/auth/login` - Legacy password login (backward compatibility)
- `POST /api/auth/register` - Legacy password registration (backward compatibility)
- `GET /api/auth/me` - Get current user

### NFTs
- `GET /api/nfts` - List NFTs with filtering, sorting, and pagination
- `GET /api/nfts/:id` - Get NFT details
- `GET /api/nfts/:id/related` - Get related NFTs
- `POST /api/nfts/:id/verify-ownership` - Verify NFT ownership on-chain
- `POST /api/nfts` - Create NFT listing (admin only)
- `GET /api/nfts/search` - Search NFTs

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart
- `POST /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders (with filtering and sorting)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order from cart
- `PATCH /api/orders/:id/status` - Update order status

### Web3
- `POST /api/web3/verify-ownership` - Verify wallet ownership

## 🔐 Authentication

The API uses JWT tokens for authentication. Tokens are generated after Privy SSO verification.

Protected routes require the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## 🔄 Transaction Monitoring

The backend includes a transaction monitoring service that:
- Monitors blockchain transactions for orders
- Automatically updates order status based on transaction confirmations
- Handles transaction failures and timeouts
- Requires `WEB3_PROVIDER_URL` to be configured

## 📦 Models

### User
- Email, password (optional), Privy user ID
- Wallet address, authentication method
- Role (user/admin)

### NFT
- Name, description, image URL
- Price, token ID, contract address
- Owner address, verified owners array
- Verification timestamp

### Order
- User ID, order number (unique)
- Subtotal, fee, total amount
- Status (pending, processing, completed, failed, cancelled)
- Transaction hash, transaction status

### CartItem
- User ID, NFT ID, quantity

### OrderItem
- Order ID, NFT ID, quantity, price

## 🛠️ Development

### Code Formatting

```bash
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Git Hooks

Pre-commit hooks automatically format code using Prettier.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `docker ps`
- Check connection string in `.env`
- Ensure MongoDB container is accessible

### Privy Authentication Issues
- Verify `PRIVY_APP_ID` and `PRIVY_APP_SECRET` are correct
- Check Privy dashboard for allowed origins
- See [ENV_SETUP.md](./ENV_SETUP.md) for detailed Privy setup

### Transaction Monitoring Not Working
- Ensure `WEB3_PROVIDER_URL` is configured
- Check RPC provider is accessible
- Verify transaction hashes are valid

## 📝 Notes

- All timestamps use UTC
- Decimal128 is used for prices to maintain precision
- Transaction monitoring requires a valid Web3 provider
- Order numbers are auto-generated and unique

# Backend Setup

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory (see `ENV_SETUP.md` for details):

```bash
# Create .env file manually
```

Required variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS

## Database Setup

### Option 1: Local MongoDB (Recommended)
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/cressey-fitness`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cressey-fitness`

## Setup Database

Run the setup script to create indexes:

```bash
npm run migrate
```

This will:
- Connect to MongoDB
- Create necessary indexes for performance
- Verify the connection

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Seed Sample Data

To populate the database with sample NFTs:

```bash
npm run seed
```

## API Endpoints

See main README.md for complete API documentation.

## Models

The backend uses Mongoose models:
- `User` - User accounts
- `NFT` - NFT listings
- `CartItem` - Shopping cart items
- `Order` - Orders
- `OrderItem` - Order line items

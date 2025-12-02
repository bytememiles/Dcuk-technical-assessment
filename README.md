# NFT E-Commerce Platform

## 📖 Overview

This is a full-stack NFT marketplace platform built with Node.js, React, and Web3 integration. A personal hobby project exploring modern web development, blockchain integration, and NFT marketplace functionality.

## 🏗️ Project Structure

```
project/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite application
├── ASSESSMENT.md     # Project features and capabilities
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (via Docker or local installation)
- MetaMask browser extension
- Privy account (free tier available at https://privy.io)
- Git
- Docker (optional, for MongoDB container)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repo>
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration (see `backend/ENV_SETUP.md` for details):
   - MongoDB connection string
   - JWT secret
   - Privy credentials
   - Web3 provider URL (optional)

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   
   Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Privy App ID:
   ```env
   VITE_PRIVY_APP_ID=your_privy_app_id_here
   ```

4. **Start MongoDB (Docker)**
   ```bash
   cd backend
   docker compose up -d mongodb
   ```

5. **Initialize Database**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

6. **Run Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3012
   - Backend API: http://localhost:5000

## 📚 Documentation

- **[backend/README.md](./backend/README.md)** - Backend setup and API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend setup and tech stack
- **[backend/ENV_SETUP.md](./backend/ENV_SETUP.md)** - Detailed environment variables configuration

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + Privy SSO
- **Web3**: Ethers.js
- **Validation**: Express Validator
- **Transaction Monitoring**: Custom service for blockchain transaction tracking

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js
- **HTTP Client**: Axios
- **Authentication**: Privy React SDK
- **Notifications**: React Toastify

## 📋 Implemented Features

### Privy SSO Authentication ✅
- Email authentication (TOTP codes)
- Google OAuth integration
- JWT token generation
- User creation/retrieval
- Wallet address extraction from Privy

### NFT Filtering, Sorting & Marketplace UI ✅
- Advanced filtering (price range, owner, contract)
- Sorting (price, date, name)
- Pagination
- Responsive marketplace UI
- Loading states and error handling
- Enhanced NFT cards with verification badges

### NFT Ownership Verification & Detail Page ✅
- On-chain ownership verification
- Signature verification with ethers.js
- ERC-721 contract interaction
- Comprehensive NFT detail page
- Related NFTs section
- Copy-to-clipboard functionality

### Order Processing with Blockchain ✅
- Order creation with unique IDs
- Platform fee calculation (2.5%)
- Transaction monitoring service
- Order status management
- Order history with filters (status, date range, sorting)
- Pagination support

## 🧪 Development Tools

- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit linting
- **Docker Compose**: MongoDB containerization

## 📄 License

This is a personal hobby project. Feel free to explore and learn from it!

---

**Happy coding! 🚀**


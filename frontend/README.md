# Frontend - NFT E-Commerce Platform

## 📋 Overview

React-based frontend application for the NFT E-Commerce Platform with Web3 integration, Privy SSO authentication, and responsive design.

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

2. Edit `.env` and add your Privy App ID:
   ```env
   VITE_PRIVY_APP_ID=your_privy_app_id_here
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3012`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── BackButton.jsx
│   │   ├── CustomDropdown.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── MarketplaceFilters.jsx
│   │   ├── Navbar.jsx
│   │   ├── NFTCard.jsx
│   │   ├── Pagination.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── SkeletonCard.jsx
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── Web3Context.jsx
│   ├── pages/           # Page components
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Marketplace.jsx
│   │   ├── NFTDetail.jsx
│   │   ├── Orders.jsx
│   │   └── Register.jsx
│   ├── utils/           # Utility functions
│   │   └── formatters.js
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Privy App ID (required for authentication)
VITE_PRIVY_APP_ID=your_privy_app_id_here

# API URL (optional, defaults to proxy in vite.config.js)
# VITE_API_URL=http://localhost:5000
```

**Note**: All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Starts Vite dev server with hot module replacement.

### Production Build

```bash
npm run build
```

Builds optimized production bundle in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Ethers.js** - Web3 library
- **Privy React SDK** - SSO authentication
- **React Toastify** - Toast notifications

## 📱 Features

### Authentication
- Privy SSO integration
- Email authentication (TOTP codes)
- Google OAuth
- JWT-based session management

### Marketplace
- NFT browsing with pagination
- Advanced filtering (price, owner, contract)
- Sorting (price, date, name)
- Responsive grid layout
- Loading states and error handling

### NFT Details
- High-resolution image display
- Comprehensive metadata
- Ownership verification
- Related NFTs section
- Copy-to-clipboard functionality

### Shopping Cart
- Add/remove items
- Quantity management
- Real-time cart updates

### Orders
- Order history with filtering
- Status tracking
- Transaction monitoring
- Date range filtering
- Sorting options

### Web3 Integration
- MetaMask wallet connection
- Wallet ownership verification
- Transaction signing
- On-chain NFT verification

## 🎨 Components

### Reusable Components
- **CustomDropdown** - Styled dropdown with animations
- **NFTCard** - NFT display card with verification badge
- **Pagination** - Pagination controls
- **ErrorMessage** - Error display with retry
- **SkeletonCard** - Loading skeleton
- **BackButton** - Conditional back navigation
- **MarketplaceFilters** - Filter panel for marketplace

### Contexts
- **AuthContext** - Authentication state and methods
- **CartContext** - Shopping cart state and methods
- **Web3Context** - Web3 wallet connection and methods

## 🔄 API Integration

The frontend communicates with the backend API through:
- Axios with base URL configuration
- Vite proxy for development (see `vite.config.js`)
- Automatic token injection via Axios interceptors

## 🎯 Routes

- `/` - Home page
- `/marketplace` - NFT marketplace
- `/nft/:id` - NFT detail page
- `/login` - Login page
- `/register` - Registration page
- `/cart` - Shopping cart (protected)
- `/checkout` - Checkout page (protected)
- `/orders` - Order history (protected)
- `/orders/:id` - Order details (protected)

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Responsive design** with mobile-first approach
- **Custom components** with consistent design system
- **Dark mode ready** (can be extended)

## 🧪 Development Tools

### Code Formatting

```bash
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Git Hooks

Pre-commit hooks automatically format code using Prettier.

## 🐛 Troubleshooting

### Privy Authentication Not Working
- Verify `VITE_PRIVY_APP_ID` is set in `.env`
- Check browser console for errors
- Ensure Privy dashboard has correct redirect URLs
- See backend/ENV_SETUP.md for Privy configuration

### API Calls Failing
- Verify backend server is running on port 5000
- Check CORS configuration in backend
- Verify Vite proxy configuration in `vite.config.js`

### Web3 Wallet Issues
- Ensure MetaMask is installed
- Check browser console for errors
- Verify wallet is connected
- Check network configuration

## 📝 Notes

- All API calls use relative paths (proxied in development)
- Toast notifications replace browser alerts
- Responsive design works on mobile, tablet, and desktop
- Web3 features require authenticated users

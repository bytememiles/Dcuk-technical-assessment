# Full-Stack NFT Developer Assessment

## 📋 Overview

**Delivery Time**: 2-3 days  
**Difficulty**: Intermediate to Advanced  
**Submission**: Complete the assessment and share your Git repository link containing the completed assessment

This assessment evaluates your full-stack development skills with NFT/Web3 experience. You'll implement features for an NFT E-Commerce Platform.

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+, MongoDB, MetaMask, Privy account (https://privy.io), Git

### Setup Steps
1. Clone repository: `git clone <repository-url> && cd Dcuk`
2. Backend: `cd backend && npm install`
   - Create `.env` (see `backend/ENV_SETUP.md`)
   - Add Privy credentials from https://dashboard.privy.io
3. Frontend: `cd frontend && npm install`
4. Database: `cd backend && npm run migrate && npm run seed`
5. Run: `npm run dev` in both `backend/` and `frontend/`

## 📝 Assessment Tasks

### Task 1: Privy SSO Authentication (Required)

**Objective**: Replace email/password auth with Privy SSO (Email & Google login).

**Backend**:
- Install `@privy-io/server-auth`
- Create `POST /api/auth/privy/verify` endpoint
- Update User model: add `privy_user_id`, `auth_method`
- Auto-create users on first Privy login
- Generate JWT tokens after Privy verification

**Frontend**:
- Install `@privy-io/react-auth`
- Set up PrivyProvider in App.jsx
- Replace login/register forms with Privy UI
- Integrate Privy hooks in AuthContext
- Support Email (magic link) and Google OAuth

**Flow**: User → Privy login → Backend verifies → Returns JWT → User authenticated

**Evaluation**: ✅ Email & Google login work | ✅ JWT generation | ✅ User creation/retrieval | ✅ Error handling

---

### Task 2: NFT Filtering, Sorting & Marketplace UI (Required)

**Objective**: Add advanced filtering/sorting backend + enhanced marketplace UI.

**Backend**:
- Update `GET /api/nfts` to support:
  - Filters: `minPrice`, `maxPrice`, `owner`, `contract`
  - Sort: `sortBy` (price|date|name), `sortOrder` (asc|desc)
- Add validation with `express-validator`
- Maintain pagination compatibility

**Frontend**:
- Filtering UI: price range, owner/contract search, sort dropdown, clear button
- Loading states: skeleton loaders, button indicators
- NFT cards: formatted price, truncated owner address, "Add to Cart", verification badge
- Error handling: user-friendly messages, retry functionality
- Responsive design: mobile-friendly grid

**Evaluation**: ✅ All filters/sorting work | ✅ UI connects to API | ✅ Responsive | ✅ Loading/error states

---

### Task 3: NFT Ownership Verification & Detail Page (Required)

**Objective**: Implement on-chain ownership verification + comprehensive detail page.

**Backend**:
- Create `POST /api/nfts/:id/verify-ownership`
- Verify signature with ethers.js
- Check on-chain ownership via contract `ownerOf(tokenId)`
- Update NFT model: `verified_owners[]`, `verification_timestamp`
- Handle errors (invalid contract, network issues)

**Frontend**:
- Display: high-res image, metadata, owner/contract addresses (with copy), token ID
- Verification UI: "Verify Ownership" button, status indicators, on-chain vs listed owner
- Purchase flow: "Add to Cart", "Buy Now", transaction status
- Related NFTs: same contract, similar price range
- Responsive: mobile-optimized layout

**Evaluation**: ✅ Signature verification | ✅ On-chain check accurate | ✅ Detail page complete | ✅ End-to-end flow works

---

### Task 4: Order Processing with Blockchain (Optional)

**Objective**: Implement order processing with on-chain transaction tracking.

**Requirements**:
- Order creation with unique ID, fee calculation, "pending" status
- `PATCH /api/orders/:id/status` endpoint
- Transaction monitoring service
- Order history with filters (status, date range, sorting)

**Flow**: Create order → Initiate transaction → Track status → Update on confirmation/failure

**Evaluation**: ✅ Complete order flow | ✅ Transaction tracking | ✅ Error handling

---

## 📊 Evaluation Criteria

| Category | Weight | Focus Areas |
|----------|--------|-------------|
| **Functionality** | 40% | Requirements met, features work, edge cases handled |
| **Code Quality** | 30% | Clean code, good structure, documentation |
| **Web3 Knowledge** | 20% | Proper ethers.js usage, security practices |
| **UI/UX** | 10% | Intuitive interface, responsive, error states |

## 📤 Submission

1. **Complete Tasks 1-3** (Task 4 optional)
2. **Push all completed assessment code to Git repository**:
   - All source code with implemented features
   - Updated README (if needed)
   - `.env.example` files (without sensitive data)
3. **Share your Git repository link** with the assessment coordinator
   - Ensure the repository contains the completed assessment
   - Make sure the repository is accessible (public or shared access)
   - Code should be well-organized and documented

## 🎓 Tips

- Start with Tasks 1-3 (required)
- Test each feature as you build
- Understand existing codebase first
- Focus on quality over quantity
- Handle errors gracefully
- Add comments to explain complex logic

## 📚 Resources

- [Privy Docs](https://docs.privy.io/) | [React SDK](https://docs.privy.io/guide/react) | [Server SDK](https://docs.privy.io/guide/server)
- [Ethers.js](https://docs.ethers.org/) | [React](https://react.dev/) | [Express](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/docs/guide.html) | [MetaMask](https://docs.metamask.io/guide/)

---

**Good luck!** Focus on clean, maintainable code and demonstrating your full-stack & Web3 expertise.

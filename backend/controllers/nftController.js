/**
 * NFT Controller
 * Handles NFT CRUD operations
 */

const NFT = require('../models/NFT');
const mongoose = require('mongoose');
const { ethers } = require('ethers');

/**
 * Get all NFTs with pagination, filtering, and sorting
 */
exports.getAllNFTs = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};

    // Price filters - Convert to Decimal128 for comparison
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        if (!isNaN(minPrice) && minPrice >= 0) {
          priceFilter.$gte = mongoose.Types.Decimal128.fromString(
            minPrice.toString()
          );
        }
      }
      if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        if (!isNaN(maxPrice) && maxPrice >= 0) {
          priceFilter.$lte = mongoose.Types.Decimal128.fromString(
            maxPrice.toString()
          );
        }
      }
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
    }

    // Owner filter
    if (req.query.owner) {
      filter.owner_address = { $regex: req.query.owner, $options: 'i' };
    }

    // Contract filter
    if (req.query.contract) {
      filter.contract_address = { $regex: req.query.contract, $options: 'i' };
    }

    // Build sort object
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let sort = {};
    switch (sortBy) {
      case 'price':
        sort = { price: sortOrder };
        break;
      case 'name':
        sort = { name: sortOrder };
        break;
      case 'date':
      default:
        sort = { createdAt: sortOrder };
        break;
    }

    // Execute query
    const nfts = await NFT.find(filter).sort(sort).skip(skip).limit(limit);

    // Get total count with filters applied
    const total = await NFT.countDocuments(filter);

    res.json({
      nfts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        minPrice: req.query.minPrice || null,
        maxPrice: req.query.maxPrice || null,
        owner: req.query.owner || null,
        contract: req.query.contract || null,
        sortBy,
        sortOrder: req.query.sortOrder || 'desc',
      },
    });
  } catch (error) {
    console.error('Get NFTs error:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
};

/**
 * Get NFT by ID
 */
exports.getNFTById = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.json({ nft });
  } catch (error) {
    console.error('Get NFT error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'NFT not found' });
    }
    res.status(500).json({ error: 'Failed to fetch NFT' });
  }
};

/**
 * Create new NFT (admin only)
 */
exports.createNFT = async (req, res) => {
  try {
    const {
      name,
      description,
      image_url,
      price,
      token_id,
      contract_address,
      owner_address,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const nft = await NFT.create({
      name,
      description: description || '',
      image_url: image_url || '',
      price,
      token_id: token_id || null,
      contract_address: contract_address || null,
      owner_address: owner_address || null,
    });

    res.status(201).json({ nft });
  } catch (error) {
    console.error('Create NFT error:', error);
    res.status(500).json({ error: 'Failed to create NFT' });
  }
};

/**
 * Search NFTs
 */
exports.searchNFTs = async (req, res) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.json({
        nfts: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const nfts = await NFT.find({
      $or: [{ name: searchRegex }, { description: searchRegex }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NFT.countDocuments({
      $or: [{ name: searchRegex }, { description: searchRegex }],
    });

    res.json({
      nfts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search NFTs error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

/**
 * Verify NFT ownership on-chain
 */
exports.verifyOwnership = async (req, res) => {
  try {
    const { id } = req.params;
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        error: 'Wallet address, signature, and message are required',
      });
    }

    // Find the NFT
    const nft = await NFT.findById(id);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Check if NFT has contract and token ID
    if (!nft.contract_address || !nft.token_id) {
      return res.status(400).json({
        error: 'NFT does not have contract address or token ID',
      });
    }

    // Verify signature
    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(400).json({
          verified: false,
          error: 'Signature verification failed',
        });
      }
    } catch (error) {
      console.error('Signature verification error:', error);
      return res.status(400).json({
        verified: false,
        error: 'Invalid signature',
      });
    }

    // Check on-chain ownership
    let onChainOwner;
    try {
      // Use a public RPC provider (you can configure this via env)
      const provider = new ethers.JsonRpcProvider(
        process.env.ETH_RPC_URL || 'https://eth.llamarpc.com'
      );

      // ERC721 standard interface
      const abi = ['function ownerOf(uint256 tokenId) view returns (address)'];

      const contract = new ethers.Contract(nft.contract_address, abi, provider);

      onChainOwner = await contract.ownerOf(nft.token_id);
      onChainOwner = onChainOwner.toLowerCase();
    } catch (error) {
      console.error('On-chain ownership check error:', error);
      return res.status(500).json({
        verified: false,
        error:
          'Failed to check on-chain ownership. Invalid contract or network issue.',
        details: error.message,
      });
    }

    // Verify ownership matches
    const isOwner = onChainOwner === walletAddress.toLowerCase();
    const isListedOwner =
      nft.owner_address &&
      nft.owner_address.toLowerCase() === walletAddress.toLowerCase();

    if (isOwner) {
      // Check if already verified
      const existingVerification = nft.verified_owners.find(
        v => v.address.toLowerCase() === walletAddress.toLowerCase()
      );

      if (!existingVerification) {
        // Add to verified owners
        nft.verified_owners.push({
          address: walletAddress,
          verified_at: new Date(),
        });
        nft.verification_timestamp = new Date();
        await nft.save();
      }

      return res.json({
        verified: true,
        walletAddress,
        onChainOwner,
        listedOwner: nft.owner_address,
        isListedOwner,
        message: isListedOwner
          ? 'Ownership verified. You are the listed owner.'
          : 'Ownership verified on-chain, but you are not the listed owner.',
      });
    } else {
      return res.status(400).json({
        verified: false,
        walletAddress,
        onChainOwner,
        listedOwner: nft.owner_address,
        error: 'Wallet address does not own this NFT on-chain',
      });
    }
  } catch (error) {
    console.error('Verify ownership error:', error);
    res.status(500).json({
      verified: false,
      error: 'Verification failed',
      details: error.message,
    });
  }
};

/**
 * Get related NFTs (same contract or similar price range)
 */
exports.getRelatedNFTs = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    const nft = await NFT.findById(id);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    const price = parseFloat(nft.price);
    const priceRange = price * 0.5; // 50% price range

    // Find related NFTs: same contract OR similar price range
    const relatedNFTs = await NFT.find({
      _id: { $ne: id }, // Exclude current NFT
      $or: [
        // Same contract
        ...(nft.contract_address
          ? [{ contract_address: nft.contract_address }]
          : []),
        // Similar price range
        {
          price: {
            $gte: mongoose.Types.Decimal128.fromString(
              (price - priceRange).toString()
            ),
            $lte: mongoose.Types.Decimal128.fromString(
              (price + priceRange).toString()
            ),
          },
        },
      ],
    })
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ relatedNFTs });
  } catch (error) {
    console.error('Get related NFTs error:', error);
    res.status(500).json({ error: 'Failed to fetch related NFTs' });
  }
};

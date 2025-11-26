/**
 * NFT Controller
 * Handles NFT CRUD operations
 */

const NFT = require('../models/NFT');
const mongoose = require('mongoose');

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

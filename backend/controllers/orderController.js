/**
 * Order Controller
 * Handles order management operations
 */

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const CartItem = require('../models/CartItem');
/**
 * Create order from cart
 */
exports.createOrder = async (req, res) => {
    try {
        const { transaction_hash } = req.body;

        // Get cart items with NFT details
        const cartItems = await CartItem.find({ user_id: req.user.id })
            .populate('nft_id');

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.nft_id.price);
            return sum + (price * item.quantity);
        }, 0);

        // Create order
        const order = await Order.create({
            user_id: req.user.id,
            total_amount: totalAmount.toString(),
            status: 'pending',
            transaction_hash: transaction_hash || null
        });

        // Create order items
        const orderItems = await Promise.all(
            cartItems.map(item => {
                return OrderItem.create({
                    order_id: order._id,
                    nft_id: item.nft_id._id,
                    quantity: item.quantity,
                    price: item.nft_id.price
                });
            })
        );

        // Clear cart
        await CartItem.deleteMany({ user_id: req.user.id });

        res.status(201).json({ order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

/**
 * Get user's orders
 */
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id })
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

/**
 * Get order by ID
 */

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderItems = await OrderItem.find({ order_id: order._id })
            .populate('nft_id');

        // Transform to match expected format
        const formattedItems = orderItems.map(item => {
            const nft = item.nft_id;
            return {
                id: item._id,
                order_id: item.order_id,
                nft_id: item.nft_id._id,
                quantity: item.quantity,
                price: item.price,
                name: nft.name,
                description: nft.description,
                image_url: nft.image_url,
                token_id: nft.token_id,
                contract_address: nft.contract_address
            };
        });

        res.json({
            order: {
                ...order.toJSON(),
                items: formattedItems
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        if (error.name === 'CastError') {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};



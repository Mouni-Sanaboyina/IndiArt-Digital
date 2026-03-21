const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Order = require('../models/Order');
const Cart  = require('../models/Cart');
const verifyToken  = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Cloudinary config for artwork uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Artwork files — images + PDFs stored in Cloudinary
const artworkStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'indiart-artworks',
    // Allow PDF as raw resource, images as image
    resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  }),
});

const uploadArtwork = multer({
  storage: artworkStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for artwork files
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPG, PNG, WebP, or PDF files allowed for artwork.'));
  },
});

// Helper: generate human-readable order ID e.g. IND-2025-0042
const generateOrderId = async () => {
  const year  = new Date().getFullYear();
  const count = await Order.countDocuments();
  const padded = String(count + 1).padStart(4, '0');
  return `IND-${year}-${padded}`;
};

// ── USER ROUTES ──────────────────────────────────────────

// POST /api/orders
// multipart/form-data: deliveryDetails (JSON string) + artworkFile (optional) + customInstructions
router.post('/', verifyToken, uploadArtwork.single('artworkFile'), async (req, res) => {
  try {
    // deliveryDetails sent as JSON string in form-data
    let deliveryDetails;
    try {
      deliveryDetails = typeof req.body.deliveryDetails === 'string'
        ? JSON.parse(req.body.deliveryDetails)
        : req.body.deliveryDetails;
    } catch {
      return res.status(400).json({ message: 'Invalid delivery details format.' });
    }

    if (
      !deliveryDetails?.name    ||
      !deliveryDetails?.phone   ||
      !deliveryDetails?.address ||
      !deliveryDetails?.city    ||
      !deliveryDetails?.pincode
    ) {
      return res.status(400).json({ message: 'All delivery details are required.' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Build artworkFile object if file was uploaded
    const artworkFile = req.file ? {
      url:          req.file.path,              // Cloudinary https:// URL
      originalName: req.file.originalname,
      fileType:     req.file.mimetype,
    } : { url: '', originalName: '', fileType: '' };

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      userId: req.user._id,
      items: cart.items.map(item => ({
        productId:      item.productId,
        productName:    item.productName,
        category:       item.category,
        image:          item.image,
        selectedConfig: item.selectedConfig,
        quantity:       item.quantity,
        unitPrice:      item.unitPrice,
        subtotal:       item.subtotal,
      })),
      totalAmount:        cart.totalAmount,
      deliveryDetails,
      artworkFile,
      customInstructions: req.body.customInstructions || '',
      status: 'pending',
      statusHistory: [{ status: 'pending', changedBy: req.user.name }],
    });

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully.',
      orderId: order.orderId,
      order,
    });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Failed to place order.' });
  }
});

// GET /api/orders/my
router.get('/my', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Get my orders error:', err);
    res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
});

// ── ADMIN ROUTES ──────────────────────────────────────────

// GET /api/orders
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// GET /api/orders/:id
router.get('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ message: 'Failed to fetch order.' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = ['approved', 'rejected', 'printed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    if (status === 'rejected' && !adminNote?.trim()) {
      return res.status(400).json({ message: 'A rejection reason is required.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    order.status = status;
    if (adminNote) order.adminNote = adminNote;
    order.statusHistory.push({ status, changedAt: new Date(), changedBy: req.user.name });

    await order.save();
    res.json({ message: `Order marked as ${status}.`, order });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Failed to update order status.' });
  }
});

module.exports = router;
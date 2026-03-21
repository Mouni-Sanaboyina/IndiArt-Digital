const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('../models/Product');
const verifyToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Images go directly to Cloudinary — returns full https:// URL in file.path
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'indiart-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── PUBLIC ──────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const products = await Product.find(filter).select('-pricingMatrix');
    res.json({ products });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// ── ADMIN ──────────────────────────────────────────────────

router.post('/', verifyToken, requireAdmin, upload.array('images', 6), async (req, res) => {
  try {
    const { name, category, description, artist, pricingMatrix, availableSizes, availablePaperTypes, availableFinishes } = req.body;

    // Cloudinary returns full https:// URL in file.path
    const images = req.files ? req.files.map(f => f.path) : [];

    let parsedMatrix;
    try { parsedMatrix = JSON.parse(pricingMatrix); }
    catch { return res.status(400).json({ message: 'pricingMatrix must be valid JSON.' }); }

    const product = await Product.create({
      name, category, description,
      artist: artist || 'IndiArt Studio',
      images,
      pricingMatrix: parsedMatrix,
      availableSizes:      availableSizes      ? JSON.parse(availableSizes)      : ['A4', 'A3'],
      availablePaperTypes: availablePaperTypes ? JSON.parse(availablePaperTypes) : ['matte', 'glossy'],
      availableFinishes:   availableFinishes   ? JSON.parse(availableFinishes)   : ['standard', 'premium'],
    });

    res.status(201).json({ message: 'Product created.', product });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

router.patch('/:id', verifyToken, requireAdmin, upload.array('images', 6), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files && req.files.length > 0) updates.images = req.files.map(f => f.path);
    if (updates.pricingMatrix)       updates.pricingMatrix       = JSON.parse(updates.pricingMatrix);
    if (updates.availableSizes)      updates.availableSizes      = JSON.parse(updates.availableSizes);
    if (updates.availablePaperTypes) updates.availablePaperTypes = JSON.parse(updates.availablePaperTypes);
    if (updates.availableFinishes)   updates.availableFinishes   = JSON.parse(updates.availableFinishes);

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deactivated.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Failed to deactivate product.' });
  }
});

module.exports = router;
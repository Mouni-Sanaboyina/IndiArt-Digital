const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const verifyToken = require('../middleware/authMiddleware');

// All cart routes require login
router.use(verifyToken);

// GET /api/cart  →  get my cart
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = { userId: req.user._id, items: [], totalAmount: 0 };
    }
    res.json({ cart });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Failed to fetch cart.' });
  }
});

// POST /api/cart/add  →  add item with config to cart
// Body: { productId, selectedConfig: { size, paperType, finish }, quantity }
router.post('/add', async (req, res) => {
  try {
    const { productId, selectedConfig, quantity = 1 } = req.body;

    if (!productId || !selectedConfig?.size || !selectedConfig?.paperType || !selectedConfig?.finish) {
      return res.status(400).json({ message: 'productId and full selectedConfig are required.' });
    }

    // Verify product exists and is active
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    // Compute unit price from pricingMatrix
    const configKey = `${selectedConfig.size}-${selectedConfig.paperType}-${selectedConfig.finish}`;
    const unitPrice = product.pricingMatrix.get(configKey);
    if (!unitPrice) {
      return res.status(400).json({ message: `No price found for config: ${configKey}` });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Check if same product + same config already in cart
    const existingIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId &&
        item.selectedConfig.size === selectedConfig.size &&
        item.selectedConfig.paperType === selectedConfig.paperType &&
        item.selectedConfig.finish === selectedConfig.finish
    );

    if (existingIndex > -1) {
      // Same config → quantity++
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].subtotal =
        cart.items[existingIndex].unitPrice * cart.items[existingIndex].quantity;
    } else {
      // Different config or new product → new line item
      cart.items.push({
        productId,
        productName: product.name,
        category: product.category,
        image: product.images[0] || '',
        selectedConfig,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity
      });
    }

    await cart.save();
    res.json({ message: 'Item added to cart.', cart });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Failed to add item to cart.' });
  }
});

// PATCH /api/cart/update  →  update quantity of a specific cart item
// Body: { itemId, quantity }
router.patch('/update', async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity < 1) {
      return res.status(400).json({ message: 'itemId and quantity (≥1) are required.' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found.' });

    item.quantity = quantity;
    item.subtotal = item.unitPrice * quantity;

    await cart.save();
    res.json({ message: 'Cart updated.', cart });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ message: 'Failed to update cart.' });
  }
});

// DELETE /api/cart/remove/:itemId  →  remove one item from cart
router.delete('/remove/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    res.json({ message: 'Item removed.', cart });
  } catch (err) {
    console.error('Remove cart item error:', err);
    res.status(500).json({ message: 'Failed to remove item.' });
  }
});

module.exports = router;
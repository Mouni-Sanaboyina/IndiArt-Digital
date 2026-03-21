const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: { type: String, required: true },
  category:    { type: String, required: true },
  image:       { type: String, default: '' },   // first image of product
  selectedConfig: {
    size:      { type: String, required: true },
    paperType: { type: String, required: true },
    finish:    { type: String, required: true }
  },
  quantity:  { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true },   // price at time of adding
  subtotal:  { type: Number, required: true }    // unitPrice * quantity
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true    // one cart per user
  },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

// Recalculate totalAmount before every save
cartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
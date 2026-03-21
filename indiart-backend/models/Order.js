const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  category:    { type: String, required: true },
  image:       { type: String, default: '' },
  selectedConfig: {
    size:      { type: String, required: true },
    paperType: { type: String, required: true },
    finish:    { type: String, required: true }
  },
  quantity:  { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  subtotal:  { type: Number, required: true }
}, { _id: true });

const statusHistorySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: String, default: 'system' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0
  },
  totalAmount: { type: Number, required: true },
  deliveryDetails: {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
    pincode: { type: String, required: true }
  },
  // User's custom artwork file — uploaded to Cloudinary
  artworkFile: {
    url:          { type: String, default: '' },   // full Cloudinary https:// URL
    originalName: { type: String, default: '' },   // original filename shown to admin
    fileType:     { type: String, default: '' },   // image/pdf/etc
  },
  customInstructions: { type: String, default: '' }, // any special notes from user

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'printed'],
    default: 'pending'
  },
  adminNote:     { type: String, default: '' },
  statusHistory: [statusHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
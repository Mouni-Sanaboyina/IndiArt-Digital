const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Business Cards', 'Flyers', 'Posters', 'T-Shirts', 'Stickers', 'Invitations']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  artist: {
    type: String,
    default: 'IndiArt Studio'
  },
  images: {
    type: [String],   // array of filenames served from /uploads
    default: []
  },
  // pricingMatrix keys are "size-paperType-finish"
  // e.g. "A4-matte-standard": 199
  pricingMatrix: {
    type: Map,
    of: Number,
    required: true
  },
  availableSizes: {
    type: [String],
    enum: ['A4', 'A3', 'A2'],
    default: ['A4', 'A3']
  },
  availablePaperTypes: {
    type: [String],
    enum: ['matte', 'glossy'],
    default: ['matte', 'glossy']
  },
  availableFinishes: {
    type: [String],
    enum: ['standard', 'premium'],
    default: ['standard', 'premium']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Product = require('./models/Product');

// ── PRICING HELPER ─────────────────────────────────────────
// Generates all size × paperType × finish combinations
const buildPricingMatrix = (base) => {
  const sizes      = ['A4', 'A3', 'A2'];
  const paperTypes = ['matte', 'glossy'];
  const finishes   = ['standard', 'premium'];
  const sizeMultiplier  = { A4: 1, A3: 1.6, A2: 2.4 };
  const paperMultiplier = { matte: 1, glossy: 1.15 };
  const finishMultiplier = { standard: 1, premium: 1.3 };

  const matrix = {};
  for (const s of sizes) {
    for (const p of paperTypes) {
      for (const f of finishes) {
        const key = `${s}-${p}-${f}`;
        matrix[key] = Math.round(
          base * sizeMultiplier[s] * paperMultiplier[p] * finishMultiplier[f]
        );
      }
    }
  }
  return matrix;
};

// ── PRODUCTS DATA ──────────────────────────────────────────
const products = [
  // ── Business Cards (base: 199)
  { name: 'Modern Elegance',    category: 'Business Cards', description: 'Sleek minimalist business card with bold typography.', artist: 'IndiArt Studio', images: ['card1.jpeg'], pricingMatrix: buildPricingMatrix(199) },
  { name: 'Luxury Gold',        category: 'Business Cards', description: 'Premium gold-foil finish with elegant design.', artist: 'IndiArt Studio', images: ['card2.jpeg'], pricingMatrix: buildPricingMatrix(249) },
  { name: 'Minimalist Black',   category: 'Business Cards', description: 'Classic black and white professional design.', artist: 'IndiArt Studio', images: ['card3.jpeg'], pricingMatrix: buildPricingMatrix(199) },
  { name: 'Corporate Blue',     category: 'Business Cards', description: 'Clean corporate design with blue accent tones.', artist: 'IndiArt Studio', images: ['card4.jpeg'], pricingMatrix: buildPricingMatrix(199) },
  { name: 'Creative Gradient',  category: 'Business Cards', description: 'Vibrant gradient background for creative professionals.', artist: 'IndiArt Studio', images: ['card5.jpeg'], pricingMatrix: buildPricingMatrix(219) },
  { name: 'Bold Statement',     category: 'Business Cards', description: 'High-contrast bold design that commands attention.', artist: 'IndiArt Studio', images: ['card6.jpeg'], pricingMatrix: buildPricingMatrix(199) },

  // ── Flyers (base: 149)
  { name: 'Event Flyer Classic', category: 'Flyers', description: 'Clean event flyer with structured layout.', artist: 'IndiArt Studio', images: ['brochure1.jpeg'], pricingMatrix: buildPricingMatrix(149) },
  { name: 'Sale Promotion',      category: 'Flyers', description: 'Eye-catching sale flyer with bold offers.', artist: 'IndiArt Studio', images: ['brochure2.jpeg'], pricingMatrix: buildPricingMatrix(149) },
  { name: 'Restaurant Menu',     category: 'Flyers', description: 'Elegant restaurant menu and promo flyer.', artist: 'IndiArt Studio', images: ['brochure3.jpeg'], pricingMatrix: buildPricingMatrix(169) },
  { name: 'Tech Launch',         category: 'Flyers', description: 'Modern tech product launch announcement flyer.', artist: 'IndiArt Studio', images: ['brochure4.jpeg'], pricingMatrix: buildPricingMatrix(149) },
  { name: 'Real Estate',         category: 'Flyers', description: 'Professional real estate property listing flyer.', artist: 'IndiArt Studio', images: ['brochure5.jpeg'], pricingMatrix: buildPricingMatrix(159) },
  { name: 'Festive Offer',       category: 'Flyers', description: 'Vibrant festive season promotional flyer.', artist: 'IndiArt Studio', images: ['brochure6.jpeg'], pricingMatrix: buildPricingMatrix(149) },

  // ── Posters (base: 299)
  { name: 'Motivational Poster',     category: 'Posters', description: 'Inspiring motivational quotes with bold visuals.', artist: 'IndiArt Studio', images: ['poster1.jpeg'], pricingMatrix: buildPricingMatrix(299) },
  { name: 'Inspirational Quote',     category: 'Posters', description: 'Beautifully typeset inspirational quote poster.', artist: 'IndiArt Studio', images: ['poster2.jpeg'], pricingMatrix: buildPricingMatrix(299) },
  { name: 'Abstract Art',            category: 'Posters', description: 'Vibrant abstract artwork for home or office.', artist: 'IndiArt Studio', images: ['poster3.jpeg'], pricingMatrix: buildPricingMatrix(349) },
  { name: 'Event Promotion',         category: 'Posters', description: 'Professional event promotion poster design.', artist: 'IndiArt Studio', images: ['poster4.jpeg'], pricingMatrix: buildPricingMatrix(299) },
  { name: 'Movie Style',             category: 'Posters', description: 'Cinematic style poster with dramatic lighting.', artist: 'IndiArt Studio', images: ['poster5.jpeg'], pricingMatrix: buildPricingMatrix(329) },
  { name: 'Business Advertisement',  category: 'Posters', description: 'Bold business advertisement poster design.', artist: 'IndiArt Studio', images: ['poster6.jpeg'], pricingMatrix: buildPricingMatrix(299) },

  // ── T-Shirts (base: 499) — no paperType/finish, but schema still works with single config
  { name: 'Classic Logo Tee',     category: 'T-Shirts', description: 'Clean logo print on premium cotton tee.', artist: 'IndiArt Studio', images: ['tshirt1.jpeg'], pricingMatrix: buildPricingMatrix(499), availableSizes: ['A4'], availablePaperTypes: ['matte'], availableFinishes: ['standard', 'premium'] },
  { name: 'Graphic Street Tee',   category: 'T-Shirts', description: 'Streetwear-inspired bold graphic t-shirt.', artist: 'IndiArt Studio', images: ['tshirt2.jpeg'], pricingMatrix: buildPricingMatrix(549), availableSizes: ['A4'], availablePaperTypes: ['matte'], availableFinishes: ['standard', 'premium'] },
  { name: 'Typography Tee',       category: 'T-Shirts', description: 'Statement typography with artistic fonts.', artist: 'IndiArt Studio', images: ['tshirt3.jpeg'], pricingMatrix: buildPricingMatrix(499), availableSizes: ['A4'], availablePaperTypes: ['matte'], availableFinishes: ['standard', 'premium'] },
  { name: 'Nature Print Tee',     category: 'T-Shirts', description: 'Nature-inspired all-over sublimation print.', artist: 'IndiArt Studio', images: ['tshirt4.jpeg'], pricingMatrix: buildPricingMatrix(599), availableSizes: ['A4'], availablePaperTypes: ['matte'], availableFinishes: ['standard', 'premium'] },
  { name: 'Minimal Icon Tee',     category: 'T-Shirts', description: 'Minimal icon design for everyday wear.', artist: 'IndiArt Studio', images: ['tshirt5.jpeg'], pricingMatrix: buildPricingMatrix(499), availableSizes: ['A4'], availablePaperTypes: ['matte'], availableFinishes: ['standard', 'premium'] },
  { name: 'Vintage Retro Tee',    category: 'T-Shirts', description: 'Retro-style vintage graphics with distressed effect.', artist: 'IndiArt Studio', images: ['tshirt6.jpeg'], pricingMatrix: buildPricingMatrix(549), availableSizes: ['A4'], availablePaperTypes: ['matte'], availableFinishes: ['standard', 'premium'] },

  // ── Stickers (base: 99)
  { name: 'Holographic Round',   category: 'Stickers', description: 'Holographic finish round sticker for branding.', artist: 'IndiArt Studio', images: ['sticker1.jpeg'], pricingMatrix: buildPricingMatrix(99) },
  { name: 'Die-Cut Brand Logo',  category: 'Stickers', description: 'Custom die-cut sticker in any shape.', artist: 'IndiArt Studio', images: ['sticker2.jpeg'], pricingMatrix: buildPricingMatrix(119) },
  { name: 'Waterproof Label',    category: 'Stickers', description: 'Durable waterproof sticker for outdoor use.', artist: 'IndiArt Studio', images: ['sticker3.jpeg'], pricingMatrix: buildPricingMatrix(109) },
  { name: 'Fun Character Set',   category: 'Stickers', description: 'Set of fun illustrated character stickers.', artist: 'IndiArt Studio', images: ['sticker4.jpeg'], pricingMatrix: buildPricingMatrix(99) },
  { name: 'Transparent Sticker', category: 'Stickers', description: 'Clear background transparent sticker set.', artist: 'IndiArt Studio', images: ['sticker5.jpeg'], pricingMatrix: buildPricingMatrix(129) },
  { name: 'Bumper Sticker',      category: 'Stickers', description: 'Extra durable bumper sticker for vehicles.', artist: 'IndiArt Studio', images: ['sticker6.jpeg'], pricingMatrix: buildPricingMatrix(99) },

  // ── Invitations (base: 349)
  { name: 'Royal Wedding Card',     category: 'Invitations', description: 'Opulent royal design for wedding invitations.', artist: 'IndiArt Studio', images: ['invite1.jpeg'], pricingMatrix: buildPricingMatrix(349) },
  { name: 'Floral Wedding',         category: 'Invitations', description: 'Delicate floral patterns for elegant weddings.', artist: 'IndiArt Studio', images: ['invite2.jpeg'], pricingMatrix: buildPricingMatrix(399) },
  { name: 'Modern Minimalist',      category: 'Invitations', description: 'Clean minimalist design for modern couples.', artist: 'IndiArt Studio', images: ['invite3.jpeg'], pricingMatrix: buildPricingMatrix(349) },
  { name: 'Birthday Celebration',   category: 'Invitations', description: 'Vibrant birthday party invitation design.', artist: 'IndiArt Studio', images: ['invite4.jpeg'], pricingMatrix: buildPricingMatrix(299) },
  { name: 'Corporate Event',        category: 'Invitations', description: 'Professional corporate event invitation.', artist: 'IndiArt Studio', images: ['invite5.jpeg'], pricingMatrix: buildPricingMatrix(349) },
  { name: 'Festival & Pooja',       category: 'Invitations', description: 'Traditional Indian festival invitation design.', artist: 'IndiArt Studio', images: ['invite6.jpeg'], pricingMatrix: buildPricingMatrix(349) },
];

// ── SEED FUNCTION ──────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing users and products');

    // Create admin account
    const admin = await User.create({
      name: 'IndiArt Admin',
      email: 'admin@indiart.com',
      password: 'Admin@123',     // will be hashed by pre-save hook
      role: 'admin'
    });
    console.log(`👤 Admin created: ${admin.email} / password: Admin@123`);

    // Create all products
    await Product.insertMany(products);
    console.log(`🖼️  ${products.length} products seeded (6 per category)`);

    console.log('\n✅ Seed complete!');
    console.log('──────────────────────────────────────');
    console.log('Admin login:  admin@indiart.com');
    console.log('Password:     Admin@123');
    console.log('──────────────────────────────────────');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
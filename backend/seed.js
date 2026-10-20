
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 1499,
    oldPrice: 2999,
    rating: 4.5,
    reviews: 120,
    stock: 20,
    featured: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Smart Watch',
    category: 'Electronics',
    price: 2199,
    oldPrice: 4999,
    rating: 4.3,
    reviews: 98,
    stock: 15,
    featured: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Casual Backpack',
    category: 'Accessories',
    price: 999,
    oldPrice: 1999,
    rating: 4.4,
    reviews: 76,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Running Shoes',
    category: 'Fashion',
    price: 1799,
    oldPrice: 3499,
    rating: 4.6,
    reviews: 142,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Classic Sunglasses',
    category: 'Fashion',
    price: 699,
    oldPrice: 1499,
    rating: 4.2,
    reviews: 65,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Ceramic Coffee Mug',
    category: 'Home & Living',
    price: 299,
    oldPrice: 599,
    rating: 4.7,
    reviews: 89,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Everyday Tote Bag',
    category: 'Accessories',
    price: 799,
    oldPrice: 1299,
    rating: 4.4,
    reviews: 54,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Minimal Desk Lamp',
    category: 'Home & Living',
    price: 899,
    oldPrice: 1599,
    rating: 4.5,
    reviews: 43,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85',
  },
];

async function seed() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error(
      'Set MONGODB_URI and JWT_SECRET in .env first.'
    );
  }

  await mongoose.connect(process.env.MONGODB_URI);

  for (const product of products) {
    await Product.updateOne(
      { name: product.name },
      { $setOnInsert: product },
      { upsert: true }
    );
  }

  const email = (
    process.env.ADMIN_EMAIL || 'admin@shopease.local'
  ).toLowerCase();

  const password = process.env.ADMIN_PASSWORD;

  if (
    !password ||
    password.length < 12 ||
    password === 'ChangeThisAdminPassword123!'
  ) {
    throw new Error(
      'Set a unique ADMIN_PASSWORD (at least 12 characters) in .env before seeding.'
    );
  }

  const existing = await User.findOne({ email });

  if (!existing) {
    await User.create({
      name: process.env.ADMIN_NAME || 'ShopEase Admin',
      email,
      password: await bcrypt.hash(password, 12),
      role: 'admin',
    });
  }

  console.log('Seed complete. Sample products are ready.');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

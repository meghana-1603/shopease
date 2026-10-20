
const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({
      featured: -1,
      createdAt: -1,
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: 'Name, category and price are required.',
      });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    res.json({ message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Your cart is empty.',
      });
    }

    const requiredAddress = [
      'fullName',
      'phone',
      'address',
      'city',
      'pincode',
    ];

    if (
      !shippingAddress ||
      requiredAddress.some(
        (key) => !String(shippingAddress[key] || '').trim()
      )
    ) {
      return res.status(400).json({
        message: 'Please complete all shipping details.',
      });
    }

    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];
      let total = 0;

      for (const item of items) {
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw Object.assign(
            new Error('Invalid item quantity.'),
            { status: 400 }
          );
        }

        const product = await Product.findById(
          item.productId
        ).session(session);

        if (!product) {
          throw Object.assign(
            new Error('A product in your cart no longer exists.'),
            { status: 400 }
          );
        }

        if (product.stock < quantity) {
          throw Object.assign(
            new Error(
              `${product.name} does not have enough stock.`
            ),
            { status: 400 }
          );
        }

        product.stock -= quantity;
        await product.save({ session });

        total += product.price * quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        });
      }

      [createdOrder] = await Order.create(
        [
          {
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            total,
          },
        ],
        { session }
      );
    });

    res.status(201).json({
      message: 'Order placed successfully.',
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
});

router.get('/mine', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:id/status',
  protect,
  adminOnly,
  async (req, res, next) => {
    try {
      const allowed = [
        'Placed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ];

      if (!allowed.includes(req.body.status)) {
        return res.status(400).json({
          message: 'Invalid order status.',
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({
          message: 'Order not found.',
        });
      }

      res.json({ order });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

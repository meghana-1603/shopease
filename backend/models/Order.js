
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        'Placed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
      default: 'Placed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

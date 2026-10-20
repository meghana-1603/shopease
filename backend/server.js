
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

if (!process.env.JWT_SECRET) {
  console.warn(
    'WARNING: JWT_SECRET is missing. Set it in backend/.env before using authentication.'
  );
}

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map((s) => s.trim())
      : 'http://localhost:5173',
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'ShopEase API is running',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    api: 'ok',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

app.use(
  '/api/auth',
  (req, res, next) =>
    mongoose.connection.readyState === 1
      ? next()
      : res.status(503).json({
          message:
            'Database is not connected. Check MONGODB_URI and Atlas network access.',
        }),
  authRoutes
);

app.use(
  '/api/products',
  (req, res, next) =>
    mongoose.connection.readyState === 1
      ? next()
      : res.status(503).json({
          message:
            'Database is not connected. Check MONGODB_URI and Atlas network access.',
        }),
  productRoutes
);

app.use(
  '/api/orders',
  (req, res, next) =>
    mongoose.connection.readyState === 1
      ? next()
      : res.status(503).json({
          message:
            'Database is not connected. Check MONGODB_URI and Atlas network access.',
        }),
  orderRoutes
);

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'That value already exists.',
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  res.status(error.status || 500).json({
    message: error.status
      ? error.message
      : 'Server error. Check the backend terminal.',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ShopEase API listening on http://localhost:${PORT}`);
});

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch((error) =>
      console.error(
        'MongoDB connection failed; API remains running, database routes return 503:',
        error.message
      )
    );
} else {
  console.warn(
    'MONGODB_URI missing. API health route works; database routes return 503.'
  );
}

module.exports = app;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createProduct, listProducts } from './controllers/product.controller';
import { register, login } from './controllers/auth.controller';
import { authenticate, authorize } from './middleware/auth.middleware';
import { createQuote, getQuote, versionQuote, listMyQuotes } from './controllers/quote.controller';
import { downloadQuotePdf } from './controllers/pdf.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Product Routes
app.get('/api/products', authenticate, listProducts);
app.post('/api/products', authenticate, authorize('Admin'), createProduct);

// Quote Routes
app.post('/api/quotes', authenticate, createQuote);
app.get('/api/quotes', authenticate, listMyQuotes);
app.get('/api/quotes/:id', authenticate, getQuote);
app.post('/api/quotes/:id/version', authenticate, versionQuote);
app.get('/api/quotes/:id/pdf', authenticate, downloadQuotePdf);

// Basic Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const start = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/producthubb';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`API Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

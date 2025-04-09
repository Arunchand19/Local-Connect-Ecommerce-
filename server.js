import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Stripe with your secret key from environment variable
const stripeKey = process.env.STRIPE_KEY || 'sk_test_51RBkJNPPVB7AxTVkwHJMPdWekPj3c61kfrx9xfBQlwbVluBtVZL20HbTztI0ZnxdyTaQJHbC06VEd7m91R0Hza6r0024lVSr3a';
const stripe = Stripe(stripeKey);
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins regardless of port
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Also allow your production domain if applicable
    const allowedDomains = ['https://your-production-domain.com'];
    if (allowedDomains.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Test route to check if server is running
app.get('/', (req, res) => {
  res.send('Stripe checkout server is running!');
});

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('Received request to create checkout session:', req.body);
    
    const { line_items, metadata, success_url, cancel_url } = req.body;
    
    if (!line_items || !line_items.length) {
      return res.status(400).json({ error: 'No line items provided' });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: success_url || `${req.headers.origin}/payment-success`,
      cancel_url: cancel_url || `${req.headers.origin}/cart`,
      metadata: metadata || {},
    });
    
    console.log('Created checkout session:', session.id);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : 'An error occurred'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Stripe server running on port ${port}`);
  console.log(`Visit http://localhost:${port} to verify the server is running`);
}); 
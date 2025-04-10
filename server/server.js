// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Configure CORS with proper error handling
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

// We only parse JSON for non-file routes. Multer handles multipart/form-data.
app.use(express.json({ limit: '10mb' }));

// Serve static files from uploads folder if needed:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Example: other routes you may have
const authRoutes = require("./routes/auth");
const workerAuthRoutes = require("./routes/workerAuth");

// The new WorkerForm routes
const workerFormRoutes = require("./routes/WorkerForm");

// The new Ticket routes
const ticketRoutes = require("./routes/tickets");

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/worker-auth", workerAuthRoutes);
app.use("/api/worker-form", workerFormRoutes);
app.use("/api/tickets", ticketRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Default route for testing
app.get('/', (req, res) => {
  res.send('API server is running!');
});

const PORT = process.env.PORT || 5001; // Use 5001 to avoid conflict with the Stripe server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

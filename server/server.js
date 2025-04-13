require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();

// Combined CORS configuration:
// - Uses a function to dynamically allow origins:
//   - Always allows requests with no origin (mobile, curl, etc.).
//   - Allows any localhost origin.
//   - Allows 'https://your-production-domain.com' and 'http://localhost:5173'.
// - Also explicitly limits the HTTP methods.
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl requests)
    if (!origin) return callback(null, true);

    // Allow all localhost origins regardless of port
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    // Allowed domains
    const allowedDomains = ['https://your-production-domain.com', 'http://localhost:5173'];
    if (allowedDomains.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Not allowed by CORS
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON for non-file routes (Multer handles multipart/form-data)
app.use(express.json({ limit: '10mb' }));

// Request logger middleware
app.use((req, res, next) => {
  const startTime = new Date();
  console.log(`📥 ${req.method} ${req.originalUrl} - ${startTime.toISOString()}`);

  // Log details after the response finishes
  res.on('finish', () => {
    const duration = new Date() - startTime;
    console.log(`📤 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it does not exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Import route modules
const authRoutes = require("./routes/auth");
const workerAuthRoutes = require("./routes/workerAuth");
const workerFormRoutes = require("./routes/WorkerForm");
const ticketRoutes = require("./routes/tickets");
const reviewRoutes = require("./routes/reviews");

// Use the routes with prefixed paths
app.use("/api/auth", authRoutes);
app.use("/api/worker-auth", workerAuthRoutes);
app.use("/api/worker-form", workerFormRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reviews", reviewRoutes);

// Health-check endpoint for quick server status
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString()
  });
});

// Default route for testing
app.get('/', (req, res) => {
  res.send('API server is running!');
});

// 404 handler: handles routes that are not defined
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
});

// Global error handler for catching all errors
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start the server and listen on the specified PORT (default 5001)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} - http://localhost:${PORT}`);
  console.log(`🛠️  API Endpoints available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check at http://localhost:${PORT}/health`);
});

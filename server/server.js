// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
// We only parse JSON for non-file routes. Multer handles multipart/form-data.
app.use(express.json());

// Serve static files from uploads folder if needed:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

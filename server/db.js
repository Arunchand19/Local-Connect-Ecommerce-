// db.js
require("dotenv").config();
const mongoose = require("mongoose");

// Connect to "local" DB for customer users data
const userConnection = mongoose.createConnection(process.env.MONGO_URI_USERS);

userConnection.on("connected", () => {
  console.log("User MongoDB connected to local database");
});

userConnection.on("error", (err) => {
  console.error("User MongoDB connection error:", err);
});

// Connect to "Form" DB for worker data
const workerConnection = mongoose.createConnection(process.env.MONGO_URI_WORKERS);

workerConnection.on("connected", () => {
  console.log("Worker MongoDB connected (Form DB)");
});

workerConnection.on("error", (err) => {
  console.error("Worker MongoDB connection error:", err);
});

module.exports = { userConnection, workerConnection };

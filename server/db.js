// db.js
require("dotenv").config();
const mongoose = require("mongoose");

// Connect to "users" DB
const userConnection = mongoose.createConnection(process.env.MONGO_URI_USERS);

userConnection.on("connected", () => {
  console.log("User MongoDB connected");
});

userConnection.on("error", (err) => {
  console.error("User MongoDB connection error:", err);
});

// Connect to "Form" DB (for WorkerForm)
const workerConnection = mongoose.createConnection(process.env.MONGO_URI_WORKERS);

workerConnection.on("connected", () => {
  console.log("Worker MongoDB connected (Form DB)");
});

workerConnection.on("error", (err) => {
  console.error("Worker MongoDB connection error:", err);
});

module.exports = { userConnection, workerConnection };

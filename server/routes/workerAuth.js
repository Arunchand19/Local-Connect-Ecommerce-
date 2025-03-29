const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { workerConnection } = require("../db");
const createWorkerModel = require("../models/Worker");
const Worker = createWorkerModel(workerConnection);

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    // Check if worker already exists
    const existingWorker = await Worker.findOne({
      $or: [{ username }, { email }],
    });
    if (existingWorker) {
      return res.status(400).json({ error: "Username or email already taken" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new worker
    const newWorker = new Worker({
      username,
      phone,
      email,
      password: hashedPassword,
    });
    await newWorker.save();
    return res.status(201).json({ message: "Worker created successfully" });
  } catch (error) {
    console.error("Worker signup error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find worker by username
    const worker = await Worker.findOne({ username });
    if (!worker) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign({ workerId: worker._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: worker.username,
        email: worker.email,
        phone: worker.phone,
      },
    });
  } catch (error) {
    console.error("Worker login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

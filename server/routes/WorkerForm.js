// routes/WorkerForm.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const WorkerForm = require("../models/WorkerForm");

// Use memoryStorage so we can store the image directly in MongoDB as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/worker-form
router.post("/", upload.single("profilePhoto"), async (req, res) => {
  try {
    // req.file is the uploaded image
    // req.body has the text fields
    const {
      fullName,
      phoneNumber,
      workerTypes,
      address,
      city,
      state,
      country,
      email,
      age,
      gender,
    } = req.body;

    // Parse workerTypes from string to object
    let parsedWorkerTypes = {};
    if (workerTypes) {
      parsedWorkerTypes = JSON.parse(workerTypes);
    }

    // Build the data object
    const newWorkerData = {
      fullName,
      phoneNumber,
      workerTypes: parsedWorkerTypes,
      address,
      city,
      state,
      country,
      email,
      age,
      gender,
      profilePhoto: {
        data: null,
        contentType: null,
      },
    };

    // If a file was uploaded, store its buffer and mimetype
    if (req.file) {
      newWorkerData.profilePhoto.data = req.file.buffer;
      newWorkerData.profilePhoto.contentType = req.file.mimetype;
    }

    const newWorker = new WorkerForm(newWorkerData);
    await newWorker.save();

    res.status(201).json({ message: "Worker details submitted successfully!" });
  } catch (error) {
    console.error("Error saving worker details:", error);
    res.status(500).json({ error: "Submission failed" });
  }
});

module.exports = router;

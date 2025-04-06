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
      costPerHour,
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
      costPerHour,
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

// GET /api/worker-form/by-type/:type
// Fetch workers by their service type (acRepair, mechanicRepair, etc)
router.get("/by-type/:type", async (req, res) => {
  try {
    const serviceType = req.params.type;
    
    // Validate service type
    const validTypes = ['acRepair', 'mechanicRepair', 'electricalRepair', 'electronicRepair', 'plumber', 'packersMovers'];
    if (!validTypes.includes(serviceType)) {
      return res.status(400).json({ error: "Invalid service type" });
    }

    // Create the query to find workers who offer this service
    const query = {};
    query[`workerTypes.${serviceType}`] = true;

    // Find workers matching the criteria
    const workers = await WorkerForm.find(query);
    
    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching workers by type:", error);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

// GET /api/worker-form/all
// Fetch all workers
router.get("/all", async (req, res) => {
  try {
    const workers = await WorkerForm.find({});
    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching all workers:", error);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

// GET /api/worker-form/:id
// Fetch a specific worker by ID
router.get("/:id", async (req, res) => {
  try {
    const worker = await WorkerForm.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }
    
    res.status(200).json(worker);
  } catch (error) {
    console.error("Error fetching worker by ID:", error);
    res.status(500).json({ error: "Failed to fetch worker details" });
  }
});

module.exports = router;

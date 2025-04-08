// routes/tickets.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const ConcertTicket = require("../models/ConcertTicket");
const SportsTicket = require("../models/SportsTicket");
const TheaterTicket = require("../models/TheaterTicket");
const FestivalsTicket = require("../models/FestivalsTicket");

// Use memoryStorage so we can store the image directly in MongoDB as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to process ticket submission
const processTicketSubmission = async (req, res, TicketModel, ticketType) => {
  try {
    // Extract the common form data
    const formData = { ...req.body };
    
    // Handle numeric fields
    if (formData.ticketPrice) {
      formData.ticketPrice = parseFloat(formData.ticketPrice);
    }
    
    if (formData.additionalFees) {
      formData.additionalFees = parseFloat(formData.additionalFees);
    }
    
    // Create the ticket data object with the ticket image
    const newTicketData = {
      ...formData,
      ticketImage: {
        data: null,
        contentType: null,
      },
    };

    // If a file was uploaded, store its buffer and mimetype
    if (req.file) {
      newTicketData.ticketImage.data = req.file.buffer;
      newTicketData.ticketImage.contentType = req.file.mimetype;
    }

    const newTicket = new TicketModel(newTicketData);
    await newTicket.save();

    res.status(201).json({ 
      message: `${ticketType} ticket submitted successfully!`,
      ticketId: newTicket._id
    });
  } catch (error) {
    console.error(`Error saving ${ticketType} ticket:`, error);
    res.status(500).json({ error: "Submission failed", details: error.message });
  }
};

// POST /api/tickets/concert - Concert ticket form
router.post("/concert", upload.single("ticketImage"), async (req, res) => {
  await processTicketSubmission(req, res, ConcertTicket, "Concert");
});

// POST /api/tickets/sports - Sports ticket form
router.post("/sports", upload.single("ticketImage"), async (req, res) => {
  await processTicketSubmission(req, res, SportsTicket, "Sports");
});

// POST /api/tickets/theater - Theater ticket form
router.post("/theater", upload.single("ticketImage"), async (req, res) => {
  await processTicketSubmission(req, res, TheaterTicket, "Theater");
});

// POST /api/tickets/festivals - Festivals ticket form
router.post("/festivals", upload.single("ticketImage"), async (req, res) => {
  await processTicketSubmission(req, res, FestivalsTicket, "Festivals");
});

// GET /api/tickets/concert - Get all concert tickets
router.get("/concert", async (req, res) => {
  try {
    const tickets = await ConcertTicket.find({}).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching concert tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// GET /api/tickets/sports - Get all sports tickets
router.get("/sports", async (req, res) => {
  try {
    const tickets = await SportsTicket.find({}).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching sports tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// GET /api/tickets/theater - Get all theater tickets
router.get("/theater", async (req, res) => {
  try {
    const tickets = await TheaterTicket.find({}).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching theater tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// GET /api/tickets/festivals - Get all festival tickets
router.get("/festivals", async (req, res) => {
  try {
    const tickets = await FestivalsTicket.find({}).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching festival tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// GET /api/tickets/:type/:id - Get a specific ticket by ID and type
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    let TicketModel;
    
    // Determine which model to use based on ticket type
    switch (type) {
      case 'concert':
        TicketModel = ConcertTicket;
        break;
      case 'sports':
        TicketModel = SportsTicket;
        break;
      case 'theater':
        TicketModel = TheaterTicket;
        break;
      case 'festivals':
        TicketModel = FestivalsTicket;
        break;
      default:
        return res.status(400).json({ error: "Invalid ticket type" });
    }
    
    const ticket = await TicketModel.findById(id);
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({ error: "Failed to fetch ticket details" });
  }
});

module.exports = router; 
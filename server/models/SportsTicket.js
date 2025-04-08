// models/SportsTicket.js
const mongoose = require("mongoose");
const { ticketConnection } = require("../db");

const sportsTicketSchema = new mongoose.Schema({
  // Event Details
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  
  // Ticket Holder Information
  seatNumber: {
    type: String,
    required: true,
  },
  ticketHolderName: {
    type: String,
    required: true,
  },
  
  // Pricing Information
  ticketPrice: {
    type: Number,
    required: true,
  },
  additionalFees: {
    type: Number,
    default: 0,
  },
  availableTickets: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Terms and Conditions
  admissionPolicies: {
    type: String,
  },
  resaleRestrictions: {
    type: String,
  },
  refundPolicies: {
    type: String,
  },
  
  // Ticket Image
  ticketImage: {
    data: Buffer,
    contentType: String,
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Export with the collection path following the same pattern as WorkerForm
module.exports = ticketConnection.model("SportsTicket", sportsTicketSchema, "Form.EventsForm.SportsTicket"); 
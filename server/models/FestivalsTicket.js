// models/FestivalsTicket.js
const mongoose = require("mongoose");
const { ticketConnection } = require("../db");

const festivalsTicketSchema = new mongoose.Schema({
  // Event Details
  festivalName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
  },
  venue: {
    type: String,
    required: true,
  },
  
  // Ticket Holder Information
  ticketType: {
    type: String,
    required: true,
    enum: ['general', 'vip', 'dayPass', 'weekend', 'camping'],
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
module.exports = ticketConnection.model("FestivalsTicket", festivalsTicketSchema, "Form.EventsForm.FestivalsTicket"); 
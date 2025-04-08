// models/WorkerForm.js
const mongoose = require("mongoose");
const { workerConnection } = require("../db");

const workerFormSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  workerTypes: {
    acRepair: { type: Boolean, default: false },
    mechanicRepair: { type: Boolean, default: false },
    electricalRepair: { type: Boolean, default: false },
    electronicRepair: { type: Boolean, default: false },
    plumber: { type: Boolean, default: false },
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  costPerHour: {
    type: String,
    required: false,
    default: "",
  },
  // Store the actual image data in MongoDB
  profilePhoto: {
    data: Buffer,
    contentType: String,
  },
});

// Updated to match the exact collection path shown in MongoDB Atlas
module.exports = workerConnection.model("WorkerForm", workerFormSchema, "Form.Form.WorkerForm");

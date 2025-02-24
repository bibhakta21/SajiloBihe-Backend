// models/ContactRequest.js
const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

module.exports = ContactRequest;

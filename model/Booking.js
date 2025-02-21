const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  bookingDate: { type: Date, default: Date.now, required: true },
  status: { type: String, enum: ["pending", "approved", "canceled"], default: "pending" },
});

module.exports = mongoose.model("Booking", BookingSchema);

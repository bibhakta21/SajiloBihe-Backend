const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers",
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "venues",
    },
    date: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

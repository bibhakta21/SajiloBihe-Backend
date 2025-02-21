const Booking = require("../model/Booking");
const Venue = require("../model/Venue");

exports.createBooking = async (req, res) => {
  try {
    const { venueId } = req.body;

    // Check if the venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    //  Check if the user has already booked this venue
    const existingBooking = await Booking.findOne({ user: req.user.id, venue: venueId });
    if (existingBooking) {
      return res.status(400).json({ error: "You have already booked this venue." });
    }

    //  Proceed with booking if it's a new booking
    const booking = new Booking({
      user: req.user.id,
      venue: venueId,
      date: new Date(), // Store the date of booking
    });

    await booking.save();
    res.status(201).json({ message: "Booking request submitted!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  Get booking details (User only)
exports.getBookingById = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate("venue user", "name email location");
      if (!booking) return res.status(404).json({ error: "Booking not found" });
  
      if (req.user.id !== booking.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
  
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


//  Get all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user.id })
        .populate("venue", "name price capacity location images");
  
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

//  Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("venue", "name images") // Get venue name & image
        .populate("user", "username email phone"); // Get user details
  
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
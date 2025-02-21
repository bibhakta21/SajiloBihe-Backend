const express = require("express");
const {
  createBooking,
  getBookingById,
  getUserBookings, 
  getAllBookings, 
  
} = require("../controller/BookingController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createBooking); 
router.get("/my-bookings", authMiddleware, getUserBookings); 
router.get("/:id", authMiddleware, getBookingById); 
router.get("/", authMiddleware, adminMiddleware, getAllBookings);

module.exports = router;

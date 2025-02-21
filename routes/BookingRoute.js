const express = require("express");
const {
  createBooking,
  getBookingById,
  getUserBookings, 
  getAllBookings, 
  cancelBooking,
  approveBooking,
  deleteBooking,
} = require("../controller/BookingController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createBooking); 
router.get("/my-bookings", authMiddleware, getUserBookings); 
router.get("/:id", authMiddleware, getBookingById); 
router.get("/", authMiddleware, adminMiddleware, getAllBookings);
router.put("/:id/cancel", authMiddleware, cancelBooking);
router.put("/:id/approve", authMiddleware, adminMiddleware, approveBooking); 
router.delete("/:id", authMiddleware, adminMiddleware, deleteBooking);

module.exports = router;

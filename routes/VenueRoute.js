const express = require("express");
const { 
  getAllVenues, 
  getVenueById, 
  createVenue, 
  updateVenue, 
  deleteVenue 
} = require("../controller/VenueController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Import upload middleware

const router = express.Router();

router.get("/", getAllVenues);
router.get("/:id", getVenueById);
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), createVenue); // Accept up to 5 images
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), updateVenue);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVenue);

module.exports = router;

const express = require("express");
const router = express.Router();
const { submitContactForm, deleteContact, getAllContacts } = require("../controller/contactController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Route to handle form submission
router.post("/submit", submitContactForm);

// Fetch all contact requests (Admin only)
router.get("/", authMiddleware, adminMiddleware, getAllContacts);



module.exports = router;

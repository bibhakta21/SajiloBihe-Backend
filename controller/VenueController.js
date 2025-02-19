const Venue = require("../model/Venue");

// Create a new venue (Admin only)
exports.createVenue = async (req, res) => {
  try {
    const { name, location, capacity, price, description, available } = req.body;

    // Ensure required fields are provided
    if (!name || !location || !capacity || !price || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Process uploaded images
    const images = req.files.map(file => `/uploads/${file.filename}`); // Store image paths

    const venue = new Venue({ name, location, capacity, price, description, images, available });
    await venue.save();

    res.status(201).json({ message: "Venue created successfully", venue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






const Story = require("../model/Story");

// Add Story (Admin Only)
exports.addStory = async (req, res) => {
  try {
    const { name, date, story } = req.body;

    // Check if all fields are provided
    if (!name || !date || !story) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure only one image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
    if (Array.isArray(req.file)) {
      return res.status(400).json({ error: "Only one image can be uploaded" });
    }

    // Save image path
    const image = `/uploads/${req.file.filename}`;

    const newStory = new Story({ name, date, story, image });
    await newStory.save();

    res.status(201).json({ message: "Story added successfully", newStory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get All Stories (Public)
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 }); // Sort by latest stories
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Story (Admin Only)
exports.updateStory = async (req, res) => {
  try {
    const { name, date, story } = req.body;
    let updatedData = { name, date, story };

    // If an image is provided, ensure only one is uploaded
    if (req.file) {
      if (Array.isArray(req.file)) {
        return res.status(400).json({ error: "Only one image can be uploaded" });
      }
      updatedData.image = `/uploads/${req.file.filename}`;
    } else if (!name && !date && !story) {
      return res.status(400).json({ error: "At least one field or an image must be provided" });
    }

    // Find and update the story
    const updatedStory = await Story.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedStory) return res.status(404).json({ error: "Story not found" });

    res.json({ message: "Story updated successfully", updatedStory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Story (Admin Only)
exports.deleteStory = async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) return res.status(404).json({ error: "Story not found" });

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

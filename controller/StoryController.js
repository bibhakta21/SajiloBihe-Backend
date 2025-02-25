const Story = require("../model/Story");

//  Add Story (Admin Only)
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

// Get All Stories (Public)
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 }); // Sort by latest stories
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const express = require("express");
const { addStory,updateStory, getAllStories, deleteStory } = require("../controller/StoryController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Multer for image upload

const router = express.Router();

// Public Route - Fetch All Stories
router.get("/", getAllStories);

// Admin Routes
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), addStory);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateStory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteStory);

module.exports = router;

const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  story: { type: String, required: true },
  image: { type: String, required: true }, // Store image path
});

module.exports = mongoose.model("Story", StorySchema);

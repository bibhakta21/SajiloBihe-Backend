const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB database
    await mongoose.connect("mongodb://localhost:27017/db_event_venue_management", {
    });
    console.log("MongoDB Connected");
  } catch (e) {
    console.error("MongoDB not connected:", e.message);
    process.exit(1);  // Exit process with failure
  }
};

module.exports = connectDB;

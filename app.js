const express = require("express");
const connectDB = require("../SajiloBihe Backend/config/db");

const app = express();

// Connect to the database
connectDB();


app.listen(5000, () => {
  console.log("Server running on port 5000");
});

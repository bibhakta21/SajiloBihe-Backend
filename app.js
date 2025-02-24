// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const venueRoutes = require("./routes/VenueRoute");
const bookingRoutes = require("./routes/BookingRoute");
const contactRoutes = require("./routes/contactRoute");






const app = express();

// Connect to the database
connectDb();

//  Fixed Allow CORS only for frontend & credentials
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Fixed CORS issue with Static File Serving
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin"); // Fix same-origin issue
  }
}));



// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);




app.get("/", (req, res) => {
  res.send("Welcome to the Venue Booking API!");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceperplate: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const Venue = mongoose.model("venues", venueSchema);

module.exports = Venue;

const express = require("express");
const connectDb = require("./config/db");
const CustomerRouter = require("./routes/CustomerRoutes");
const VenueRouter = require("./routes/VenueRoute");
const BookingRouter = require("./routes/BookingRoute");
const AuthRouter = require("./routes/AuthRoutes");

const app = express();

connectDb();

app.use(express.json());

app.use("/api/customer", CustomerRouter);
app.use("/api/venue", VenueRouter);
app.use("/api/booking", BookingRouter);
app.use("/api/auth", AuthRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

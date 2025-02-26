const Booking = require("../model/Booking");
const Venue = require("../model/Venue");
const User = require("../model/User");
const ContactRequest = require("../model/ContactRequest");

exports.getDashboardData = async (req, res) => {
    try {
        // ✅ 1. Sales Summary Cards (KPIs)
        const totalSales = await Booking.countDocuments(); // Total bookings (represents sales)
        const totalOrders = await Booking.countDocuments(); // Total orders
        const totalVenues = await Venue.countDocuments(); // Total venues available
        const totalCustomers = await User.countDocuments(); // Total registered users

        // ✅ 2. Venue Booking Distribution (Pie Chart)
        const venueBookings = await Booking.aggregate([
            { $group: { _id: "$venue", count: { $sum: 1 } } },
            { $lookup: { from: "venues", localField: "_id", foreignField: "_id", as: "venue" } },
            { $unwind: "$venue" },
            { $project: { venueName: "$venue.name", count: 1 } }
        ]);

        // ✅ 3. Weekly Booking Count (Bar Chart)
        const weeklyBookings = await Booking.aggregate([
            { $group: { _id: { $week: "$bookingDate" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        // ✅ 4. Cancellations vs Approved Bookings (Doughnut Chart)
        const bookingStatus = await Booking.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // ✅ 5. Contact Requests Trends (Line Chart)
        const contactRequests = await ContactRequest.aggregate([
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        // ✅ Send Data as Response
        res.json({
            totalSales,
            totalOrders,
            totalVenues,
            totalCustomers,
            venueBookings,
            weeklyBookings,
            bookingStatus,
            contactRequests
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch dashboard data." });
    }
};

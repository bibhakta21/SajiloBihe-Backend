const Booking = require('../model/Booking');
const nodemailer = require("nodemailer");

const findAll = async (req, res) => {
    try {
        const bookings = await Booking.find().populate(["customerId", "venueId"]);
        res.status(200).json(bookings);
    } catch (e) {
        res.status(500).json({ message: "Error fetching bookings", error: e });
    }
};

const save = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "bibhakta10@gmail.com", 
                pass: "megatron321@", 
            },
        });

        // Send email notification
        const info = await transporter.sendMail({
            from: "bibhakta10@gmail.com", // Sender's email
            to: req.body.customerEmail, 
            subject: "Booking Confirmation",
            html: `
                <h1>Booking Confirmed</h1>
                <p>Thank you for booking with us!</p>
                <p>Booking Details:</p>
                <ul>
                    <li>Booking ID: ${booking.id}</li>
                    <li>Venue: ${req.body.venueName}</li> <!-- Include venue details if available -->
                    <li>Date: ${req.body.date}</li>
                </ul>
                <p>We look forward to hosting you!</p>
            `,
        });

        res.status(201).json({ booking, info });
    } catch (e) {
        res.status(500).json({ message: "Error saving booking", error: e });
    }
};

module.exports = {
    findAll,
    save,
};

const Booking = require('../model/Booking');

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
        res.status(201).json(booking);
    } catch (e) {
        res.status(500).json({ message: "Error saving booking", error: e });
    }
};

module.exports = {
    findAll,
    save,
};

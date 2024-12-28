const Customer = require('../model/Customer');
const nodemailer = require("nodemailer");

// Fetch all customers
const findAll = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (e) {
        res.json(e);
    }
};

// Save a new customer and send a confirmation email
const save = async (req, res) => {
    try {
        const customer = new Customer(req.body); // Create a new customer instance from the request body
        await customer.save(); // Save customer to the database

        // Configure the nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            protocol: "smtp",
            auth: {
                user: "bibhakta10@gmail.com", 
                pass: "megatron321@", 
            },
        });

        // Send an email to the newly registered customer
        const info = transporter.sendMail({
            from: "bibhakta10@gmail.com",
            to: customer.email,
            subject: "Customer Registration",
            html: `
                <h1>Your Registration has been Completed</h1>
                <p>Your user ID is ${customer.id}</p>
            `,
        });

        res.status(201).json({ customer, info });
    } catch (e) {
        res.json(e);
    }
};

// Find a customer by ID
const findById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.status(200).json(customer);
    } catch (e) {
        res.json(e);
    }
};

// Delete a customer by ID
const deleteById = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json("Data Deleted");
    } catch (e) {
        res.json(e);
    }
};

// Update a customer by ID
const update = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(customer);
    } catch (e) {
        res.json(e);
    }
};

module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    update,
};

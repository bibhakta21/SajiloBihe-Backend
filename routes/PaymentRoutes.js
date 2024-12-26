const express = require("express");
const router = express.Router();
const { client } = require("../config/PaypalConfig");
const paypal = require("@paypal/checkout-server-sdk");

// Create Order
router.post("/create-order", async (req, res) => {
    const { amount } = req.body;
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: "NPR",
                value: amount,
            },
        }],
    });

    try {
        const response = await client().execute(request);
        res.status(201).json({ id: response.result.id });
    } catch (err) {
        res.status(500).json({ message: "Error creating order", error: err });
    }
});

// Capture Payment
router.post("/capture-order", async (req, res) => {
    const { orderId } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const response = await client().execute(request);
        res.status(200).json(response.result);
    } catch (err) {
        res.status(500).json({ message: "Error capturing order", error: err });
    }
});

module.exports = router;

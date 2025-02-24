
const ContactRequest = require("../model/ContactRequest");

const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Create a new contact request
    const contactRequest = new ContactRequest({
      name,
      email,
      phone,
      message,
    });

    // Save to the database
    await contactRequest.save();

    res.status(201).json({
      message: "Message sent successfully!",
      contact: contactRequest, // ✅ Include the saved contact with _id
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
};

module.exports = { submitContactForm };











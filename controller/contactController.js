
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


const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if contact request exists
    const contact = await ContactRequest.findById(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact request not found!" });
    }

    // Delete contact request
    await ContactRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "Contact request deleted successfully!" });
  } catch (error) {
    console.error("Error deleting contact request:", error);
    res.status(500).json({ error: "Failed to delete contact request. Please try again later." });
  }
};


const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactRequest.find(); // Fetch all contact requests
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts. Please try again later." });
  }
};

module.exports = { submitContactForm, deleteContact, getAllContacts };





const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


// Register user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, role, avatar } = req.body;

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists. Please try another." });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already in use. Please use a different email." });
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: "Phone number is already in use. Please use a different number." });
    }

    // Create and save new user
    const user = new User({ username, email, phone, password, role, avatar });
    await user.save();

    res.status(201).json({ success: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;
  const cred = await Credential.findOne({ username });

  // Check if the username exists or if password comparison fails
  if (!cred || !(await bcrypt.compare(password, cred.password))) {
    return res.status(403).send('Invalid username or password');
  }

  // Generate the JWT token with additional user details (email and number)
  const token = jwt.sign(
    { 
      username: cred.username, 
      role: cred.role,
      email: cred.email, // Add email to the token
      number: cred.number // Add contact number to the token
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  // Send the token back to the frontend
  res.json({ token });
};


module.exports = {
  login,
  register
}
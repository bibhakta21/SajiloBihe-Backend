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


// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email does not exist" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, success: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all users (Admin)
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Get user by ID (Admin)
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// Get current user details
exports.getUserByMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude the password field
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    // Check if the username is already taken by another user
    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Username is already taken. Please choose another one." });
    }

    // Check if the email is already taken by another user
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Email is already in use. Please use a different email." });
    }

    // Check if the phone number is already taken by another user
    const existingPhone = await User.findOne({ phone });
    if (existingPhone && existingPhone._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Phone number is already in use. Please use a different phone number." });
    }

    // Proceed with the update
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { username, email, phone },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ success: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Create user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists. Please choose another." });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already in use. Please use a different email." });
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: "Phone number is already in use. Please use a different phone number." });
    }

    // Validate phone number (10-15 digits)
    if (!/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be between 10-15 digits." });
    }

    // Create new user
    const user = new User({ username, email, phone, password, role });
    await user.save();

    res.status(201).json({ success: "User created successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
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





exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare old password with stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    // Update with new password (hashed in pre-save hook)
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.json({ success: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email does not exist" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You have requested to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nThis link is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: "Check your Gmail. Reset link has been sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    // Update password and set passwordChangedAt
    user.password = newPassword; // Will be hashed due to pre-save hook
    user.passwordChangedAt = Date.now();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successfully! Please log in again." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

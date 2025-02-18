const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  avatar: { type: String, default: "" }, 
  role: { type: String, enum: ["admin", "user"], default: "user" },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  passwordChangedAt: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

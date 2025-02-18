const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordChangedAt = Date.now() - 1000; 
  next();
});

module.exports = mongoose.model("User", UserSchema);

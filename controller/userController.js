const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2e54538f5f451633b71e39f957cf01";
const Credential = require("../model/Crendential")
const Customer = require("../model/Customer");


const register = async (req, res) => {
  try {
      console.log("Incoming Registration Data:", req.body); // Debugging

      const { email, number, username, password, role } = req.body;

      // Check if username already exists
      const existingUser = await Credential.findOne({ username }); // ✅ Use Credential
      if (existingUser) {
          console.log("Username already exists"); // Debugging
          return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new customer
      const newCustomer = new Customer({
          email,
          contact_no: number
      });

      const savedCustomer = await newCustomer.save();
      console.log("Customer Created:", savedCustomer); // Debugging

      // Create credentials linked to customer
      const newCred = new Credential({ // ✅ Use Credential instead of Cred
          username,
          password: hashedPassword,
          role: role || "customer",
          customer_id: savedCustomer._id // Link customer ID
      });

      await newCred.save();
      console.log("Credentials Created:", newCred); // Debugging

      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
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
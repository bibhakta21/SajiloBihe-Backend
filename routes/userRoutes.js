const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById, 
  deleteUser, 
  updateUser,
  createUser, 
  getUserByMe,
  changePassword,
  forgotPassword,
  resetPassword
} = require("../controller/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserByMe);
router.put("/me", authMiddleware, updateUser);
router.put("/change-password", authMiddleware, changePassword); // Change password
router.post("/forgot-password", forgotPassword); // Forgot password
router.post("/reset-password", resetPassword); // Reset password
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.post("/", authMiddleware, adminMiddleware, createUser);

module.exports = router;

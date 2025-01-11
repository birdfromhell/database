const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users/usersController");
const verifyToken = require("../../middleware/verifyToken");

// Endpoint untuk login
router.post("/login", userController.login);
// Endpoint untuk signup
router.post("/signup", userController.signUp);
// Endpoint untuk verify otp 
//router.post("/signup-verify-otp", userController.SignverifyOtp);
// Endpoint untuk Forgot Password
router.post("/forgot-password", userController.forgotPassword);

// Endpoint untuk verifikasi OTP
router.post("/verify-otp", userController.verifyOtp);


// Endpoint untuk reset password
router.post("/reset-password", userController.resetPassword);
// Endpoint untuk CRUD
router.get("/profile", verifyToken, userController.getUserByUsername);
router.get("/", userController.getAllUser);
router.post("/",  userController.createUser);
router.put("/:username", userController.updateUser);
router.put("/update/:username", userController.updatePassword);
router.delete("/", verifyToken, userController.deleteUser);

module.exports = router;
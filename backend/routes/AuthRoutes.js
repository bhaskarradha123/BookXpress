const express = require("express");
const { register, login } = require("../controllers/AuthController");
const authMiddleware = require("../middleWare/AuthMiddleWare");
const { forgotPassword, resetPassword } = require("../controllers/PasswordController");
const { profile, updateProfile, deleteAccount, updateAddress } = require("../controllers/UserController");
const router = express.Router();
// private
router.get("/me", authMiddleware, profile);
router.post("/updateProfile", authMiddleware, updateProfile);
router.delete("/deleteAccount", authMiddleware, deleteAccount);
router.put("/updateAddress", authMiddleware, updateAddress);

//password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// public
router.post("/register", register);
router.post("/login", login);



module.exports = router;

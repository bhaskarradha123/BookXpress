const express = require("express");
const { register, login, getMe } = require("../controllers/AuthController");
const authMiddleware = require("../middleWare/AuthMiddleWare");
const { forgotPassword, resetPassword } = require("../controllers/PasswordController");

const router = express.Router();

// public
router.post("/register", register);
router.post("/login", login);

// private
router.get("/me", authMiddleware, getMe);

//password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

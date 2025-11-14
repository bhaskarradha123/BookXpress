const express = require("express");
const { register, login, getMe } = require("../controllers/AuthController");
const authMiddleware = require("../middleWare/AuthMiddleWare");

const router = express.Router();

// public
router.post("/register", register);
router.post("/login", login);

// private
router.get("/me", authMiddleware, getMe);

module.exports = router;

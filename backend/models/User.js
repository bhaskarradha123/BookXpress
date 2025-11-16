const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer", "seller"],
      default: "customer",
    },
    gender: { type: String, enum: ["MALE", "FEMALE"] },
    phone: { type: Number, unique: true },
    address: {
      doorNo: String,
      street: String,
      city: String,
      state: String,
      pinCode: String,
    },
    otp: { type: String },
    otpExpire: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

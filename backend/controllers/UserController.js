const User = require("../models/User");

// =============================
// GET /me  → Fetch profile
// =============================
exports.profile = async (req, res) => {
  try {
    const userId = req.user.id; // coming from authMiddleware

    const user = await User.findById(userId).select("-password -otp -otpExpire");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};


// =======================================
// POST /updateProfile → Update profile
// =======================================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, gender, phone } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(gender && { gender }),
          ...(phone && { phone }),
        }
      },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpire");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};


// =======================================
// PUT /updateAddress → Update address
// =======================================
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { street, city, state, pinCode } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "address.street": street,
          "address.city": city,
          "address.state": state,
          "address.pinCode": pinCode,
        }
      },
      { new: true }
    ).select("-password -otp -otpExpire");

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      user: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};


// =======================================
// DELETE /deleteAccount → Delete account
// =======================================
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};

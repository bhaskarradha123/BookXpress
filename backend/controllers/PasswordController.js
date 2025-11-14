const crypto = require("crypto");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // valid 10 mins
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP 🔑",
      `
        <h2>Hello ${user.name}</h2>
        <p>Your OTP for password reset is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <br>
        <p>Regards,<br>BookStore Team</p>
      `
    );

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpire < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = newPassword;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

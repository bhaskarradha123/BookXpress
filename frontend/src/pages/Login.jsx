import { useState, useContext, useEffect } from "react";
import { loginUser } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // ✨ PASSWORD VALIDATION
  const validatePassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[@$!%*?&]/.test(pwd),
    };
  };

  // ✨ LIVE VALIDATION
  useEffect(() => {
    let newErrors = {};

    if (!email.includes("@")) newErrors.email = "Enter a valid email";

    const pwdRules = validatePassword(password);
    if (!Object.values(pwdRules).every(Boolean))
      newErrors.password =
        "Password should include: 8 chars, uppercase, number, special character";

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const res = await loginUser({ email, password });
      login(res.data);
      alert("Login Successful");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
      }}
    >
      <div
        className="w-full md:w-[50%] lg:w-[65%] xl:w-[30%] 
                    backdrop-blur-xl bg-white/10 border border-white/20 
                    shadow-2xl p-10 rounded-3xl animate-slideUp"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Welcome Back 📚
        </h2>

        {/* Google Login */}
        <button
          className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-3
                     bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                     hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                     hover:scale-[1.05] active:scale-[0.98]
                     transition-all duration-300"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className="my-5 text-center text-white/70">or</div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-white/20 border 
                ${errors.email ? "border-red-500" : "border-white/40"} 
                text-white placeholder-white/70 focus:outline-none 
                focus:ring-2 focus:ring-pink-300`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD + EYE ICON */}
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-white/20 border 
                ${errors.password ? "border-red-500" : "border-white/40"} 
                text-white placeholder-white/70 focus:outline-none 
                focus:ring-2 focus:ring-blue-300 pr-12`}
            />

            {/* Eye Icon */}
            <span
              className="absolute right-4 top-3 cursor-pointer text-white/70"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl text-white font-bold transition shadow-lg
              ${isFormValid
                ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-[1.03]"
                : "bg-white/20 cursor-not-allowed"
              }`}
          >
            Login
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-5 text-center text-white">
          <p>
            Don’t have an account?{" "}
            <Link
              className="text-yellow-300 underline hover:text-red-200"
              to="/register"
            >
              Register
            </Link>
          </p>

          <p className="mt-2">
            Forgot Password?{" "}
            <Link
              className="text-blue-300 underline hover:text-blue-200"
              to="/forgot-password"
            >
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

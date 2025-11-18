import React, { useState, useEffect } from "react";
import { registerUser } from "../api/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // ✨ PASSWORD VALIDATION FUNCTION
  const validatePassword = (pwd) => {
    const rules = {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[@$!%*?&]/.test(pwd),
    };

    return rules;
  };

  // ✨ LIVE FORM VALIDATION
  useEffect(() => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.includes("@"))
      newErrors.email = "Enter a valid email address";

    if (form.phone.length !== 10)
      newErrors.phone = "Phone must be 10 digits";

    const pwdRules = validatePassword(form.password);
    if (!Object.values(pwdRules).every(Boolean))
      newErrors.password = "Password is too weak";

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchRole = () => {
    const newRole = role === "customer" ? "seller" : "customer";
    setRole(newRole);
    setForm({ ...form, role: newRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await registerUser(form);
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-200 to-blue-50">
      <div className="relative w-[900px] h-[520px] shadow-2xl rounded-[35px] overflow-hidden bg-white">

        {/* SLIDING PANEL */}
        <div
          className={`absolute top-0 h-full w-1/2 rounded-[35px] bg-gradient-to-br from-blue-600 to-blue-400 text-white flex flex-col justify-center items-center px-12 transition-all duration-700 ${
            role === "customer"
              ? "translate-x-full rounded-l-[35px]"
              : "translate-x-0 rounded-r-[35px]"
          }`}
        >
          <h1 className="text-4xl font-bold mb-4">
            {role === "customer" ? "Create Seller Account!" : "Create Customer Account!"}
          </h1>

          <button
            onClick={switchRole}
            className="px-8 py-2 border border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition font-semibold"
          >
            {role === "customer" ? "Switch to Seller" : "Switch to Customer"}
          </button>
        </div>

        {/* FORM PANEL */}
        <div
          className={`absolute top-0 h-full w-1/2 bg-white flex flex-col justify-center px-12 transition-all duration-700 ${
            role === "customer" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {role === "customer" ? "Customer Sign Up" : "Seller Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                value={form.name}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none ${
                  errors.name && "border border-red-500"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={form.email}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none ${
                  errors.email && "border border-red-500"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* PASSWORD + EYE */}
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none pr-12 ${
                  errors.password && "border border-red-500"
                }`}
              />

              {/* EYE ICON */}
              <span
                className="absolute right-4 top-3 cursor-pointer text-gray-600"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                value={form.phone}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none ${
                  errors.phone && "border border-red-500"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 rounded-xl text-white transition ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Register as {role}
            </button>

            {/* GOOGLE BUTTON */}
            <button
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-3
                         bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                         hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                         hover:scale-[1.05] transition-all duration-300"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-6 h-6"
                alt="Google"
              />
              Continue with Google
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

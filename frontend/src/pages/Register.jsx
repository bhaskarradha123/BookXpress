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

  const validatePassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[@$!%*?&]/.test(pwd),
    };
  };

  useEffect(() => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Enter a valid email";
    if (form.phone.length !== 10) newErrors.phone = "Phone must be 10 digits";

    const pwdRules = validatePassword(form.password);
    if (!Object.values(pwdRules).every(Boolean))
      newErrors.password = "Weak password";

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
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-200 to-blue-50 px-10">
      
      {/* OUTER WRAPPER - Responsive */}
      <div className="
        relative w-full max-w-5xl 
        h-auto md:h-[520px]
        shadow-2xl rounded-[35px] 
        overflow-hidden bg-white
        flex flex-col md:flex-row
      ">

        {/* LEFT SLIDING PANEL (only slides on desktop) */}
        <div
          className={`
            md:absolute md:top-0 
            md:h-full md:w-1/2 
            flex flex-col justify-center items-center text-white px-10 py-10
            bg-gradient-to-br from-blue-600 to-blue-400
            transition-all duration-700
            rounded-none
            ${role === "customer"
              ? "md:translate-x-full md:rounded-l-[35px]"
              : "md:translate-x-0 md:rounded-r-[35px]"
            }
            
            /* MOBILE: always full width */
            w-full md:w-1/2
          `}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {role === "customer"
              ? "Create Seller Account!"
              : "Create Customer Account!"}
          </h1>

          <button
            onClick={switchRole}
            className="px-8 py-2 border border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition font-semibold mt-4"
          >
            {role === "customer" ? "Switch to Seller" : "Switch to Customer"}
          </button>
        </div>

        {/* RIGHT FORM PANEL */}
        <div
          className={`
            bg-white flex flex-col justify-center px-8 md:px-12 py-10
            transition-all duration-700
            w-full md:w-1/2
            ${role === "customer" ? "md:translate-x-0" : "md:translate-x-full"}
          `}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            {role === "customer" ? "Customer Sign Up" : "Seller Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* NAME */}
            <div>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                value={form.name}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none ${errors.name && "border border-red-500"
                  }`}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={form.email}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none ${errors.email && "border border-red-500"
                  }`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none pr-12 ${errors.password && "border border-red-500"
                  }`}
              />

              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-3 cursor-pointer text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>

              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            {/* PHONE */}
            <div>
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                value={form.phone}
                className={`w-full bg-gray-100 px-4 py-3 rounded-xl outline-none ${errors.phone && "border border-red-500"
                  }`}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 rounded-xl text-white transition ${isFormValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Register as {role}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center md:text-left">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

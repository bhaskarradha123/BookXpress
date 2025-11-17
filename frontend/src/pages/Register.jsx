import React, { useState } from "react";
import { registerUser } from "../api/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });

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

        {/* ---------------------- SLIDING BLUE PANEL ---------------------- */}
        <div
          className={`absolute top-0 h-full w-1/2 rounded-[35px] bg-gradient-to-br from-blue-600 to-blue-400 text-white flex flex-col justify-center items-center px-12 transition-all duration-700 ${role === "customer" ? "translate-x-full rounded-l-[35px]" : "translate-x-0 rounded-r-[35px]"
            }`}
        >
          <h1 className="text-4xl font-bold mb-4">
            {role === "customer" ? "Create Seller Account!" : "Create Customer Account!"}
          </h1>

          <p className="mb-6 opacity-90 text-center">
            {role === "customer"
              ? "Switch to seller registration"
              : "Switch to customer registration"}
          </p>

          <button
            onClick={switchRole}
            className="px-8 py-2 border border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition font-semibold"
          >
            {role === "customer" ? "Switch to Seller" : "Switch to Customer"}
          </button>
        </div>

        {/* ---------------------- FORM PANEL ---------------------- */}
        <div
          className={`absolute top-0 h-full w-1/2 bg-white flex flex-col justify-center px-12 transition-all duration-700 ${role === "customer" ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {role === "customer" ? "Customer Sign Up" : "Seller Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={form.name}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-xl outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              value={form.email}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-xl outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-xl outline-none"
            />

            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              value={form.phone}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-xl outline-none"
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Register as {role}
            </button>
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

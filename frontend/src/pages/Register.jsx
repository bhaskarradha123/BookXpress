import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer", // default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRole = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>

        {/* ROLE SELECTION BUTTONS */}
        <div style={styles.roleContainer}>
          <button
            type="button"
            onClick={() => handleRole("customer")}
            style={{
              ...styles.roleBtn,
              background: form.role === "customer" ? "#4CAF50" : "#ddd",
              color: form.role === "customer" ? "#fff" : "#000",
            }}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => handleRole("seller")}
            style={{
              ...styles.roleBtn,
              background: form.role === "seller" ? "#4CAF50" : "#ddd",
              color: form.role === "seller" ? "#fff" : "#000",
            }}
          >
            Seller
          </button>
        </div>

        {/* INPUTS */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="number"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.submitBtn}>
          Register
        </button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;

// Inline styles
const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f6f6f6",
  },
  card: {
    width: "400px",
    padding: "25px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  roleContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  roleBtn: {
    width: "48%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    cursor: "pointer",
  },
};

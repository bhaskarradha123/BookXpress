import { useState, useContext } from "react";
import API, { loginUser } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      console.log(res.data);
      
      login(res.data);

      alert("Login Successful");
    } catch (err) {
      console.log(err);
      
      alert("Invalid credentials");
    }
  };

  return (
  <>
    <button >Google</button>
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <p>Don't have an account? <Link to="/register">Register</Link></p>
      <p>Forgot Password? <Link to="/forgot-password">Reset Password</Link></p>
      <button>Login</button>

    </form>
    </>
  );
}

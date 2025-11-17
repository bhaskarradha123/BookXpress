import { useState, useContext } from "react";
import { loginUser } from "../api/axios";
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


    {/* RIGHT LOGIN FORM */}
    <div className="w-full md:w-[50%] lg:w-[65%] xl:w-[30%] 
                    backdrop-blur-xl bg-white/1 border border-white/20 
                    shadow-2xl p-10 rounded-3xl animate-slideUp">

      <h2 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
        Welcome Back 📚
      </h2>

      {/* Google Login */}
      <button className="w-full bg-white text-black py-3 rounded-xl font-semibold 
                         shadow-lg hover:scale-[1.09] transition">
        Continue with Google
      </button>

      <div className="my-5 text-center text-white/70">or</div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/40 
                     text-white placeholder-white/70 focus:outline-none 
                     focus:ring-2 focus:ring-pink-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/40 
                     text-white placeholder-white/70 focus:outline-none 
                     focus:ring-2 focus:ring-blue-300"
        />

        {/* LOGIN BUTTON */}
        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 
                           rounded-xl text-white font-bold hover:scale-[1.03] 
                           transition shadow-lg">
          Login
        </button>
      </form>

      {/* Links */}
      <div className="mt-5 text-center text-white">
        <p>
          Don’t have an account?{" "}
          <Link className="text-yellow-300 underline hover:text-red-200" to="/register">
            Register
          </Link>
        </p>

        <p className="mt-2">
          Forgot Password?{" "}
          <Link className="text-blue-300 underline hover:text-blue-200" to="/forgot-password">
            Reset Password
          </Link>
        </p>
      </div>
    </div>

  
  </div>
);

}

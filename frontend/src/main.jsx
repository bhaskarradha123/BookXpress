import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Import your Provider
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
     <ToastContainer position="top-right" autoClose={2000} />

        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

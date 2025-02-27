import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css"; // Make sure to create and import the corresponding CSS file
import { FaUser, FaLock } from "react-icons/fa";

const Signin  = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });
      console.log("Response Data:", response.data);

      if (response.data.role) {
        const { role } = response.data;
        localStorage.setItem("role", role);

        if (role === "ADMIN") {
          navigate("/dashboard");
        } else if (role === "PATIENT") {
          navigate("/patient");
        } else if (role === "DOCTOR") {
          navigate("/doctor");
        } else if (role === "NURSE") {
          navigate("/nurse");
        }
      } else {
        alert("Rôle utilisateur non défini. Veuillez contacter l'administrateur.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="wrapper">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signin ;

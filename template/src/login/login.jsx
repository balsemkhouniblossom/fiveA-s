import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./login.css";
import { FaUser, FaLock } from "react-icons/fa";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const clientId = "300857414061-8ff3ed18qghlb7r1bcqom4a52ki58ch0.apps.googleusercontent.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.localStorage.setItem("isLogedIn", true);
  
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
  
      if (response.data.message === "Vérification requise") {
        localStorage.setItem("pendingEmail", response.data.email);
        navigate("/codeAuth"); 
      } else if (response.data.role) {
        const { role, name, userId } = response.data;
        localStorage.setItem("role", role);
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", userId);
  
        if (role === "ADMIN") navigate("/dashboard");
        else if (role === "PATIENT") navigate("/patient");
        else if (role === "DOCTOR") navigate("/doctor");
        else if (role === "NURSE") navigate("/nurse");
      } else {
        alert("Rôle utilisateur non défini. Veuillez contacter l'administrateur.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Email ou mot de passe incorrect.");
    }
  };
  

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const credentialResponse = jwtDecode(response.credential);
      console.log("Google User:", credentialResponse);
      window.localStorage.setItem("isLogedIn",true)

      const serverResponse = await axios.post("http://localhost:3001/google-login", {
        token: response.credential,
      });

      if (serverResponse.data.role) {
        const { role, name, userId } = serverResponse.data; // Include userId
        localStorage.setItem("role", role);
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", userId); // Store userId

        if (role === "ADMIN") navigate("/dashboard");
        else if (role === "PATIENT") navigate("/patient");
        else if (role === "DOCTOR") navigate("/doctor");
        else if (role === "NURSE") navigate("/nurse");
      }
    } catch (error) {
      alert("Erreur lors de la connexion avec Google.");
    }
  };

  return (
    <div className="login-page">
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

          <button type="submit" className="login-btn">Login</button>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="google-login">
          <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => alert("Connexion échouée")} />
    </GoogleOAuthProvider>
          </div>

          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;

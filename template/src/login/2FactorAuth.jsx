import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css"; // Assurez-vous que ce fichier est bien importé
import { Link, useNavigate } from "react-router-dom";

function FactoryAuth() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await axios.post("http://localhost:3001/verify-code",{email,code})
        if(response.status===200){
            const {role, name} = response.data;
            window.localStorage.getItem("userName",name)
            if (role === "ADMIN") navigate("/dashboard");
            else if (role === "PATIENT") navigate("/patient");
            else if (role === "DOCTOR") navigate("/doctor");
            else if (role === "NURSE") navigate("/nurse");

        }
        
    } catch (error) {
        alert("code expire ou in correct")
        console.log(error)
        
    }
     
  };

  return (
      <div className="login-page">
      <div className="wrapper">
          <form onSubmit={handleSubmit} className="form-container">
              <h1 className="form-title">Code a envoiyer </h1>
             
              <div className="input-box">
                  <input
                      type="text"
                      placeholder="Entrez votre code "
                      autoComplete="off"
                      className="form-control"
                      onChange={(e) => setCode(e.target.value)}
                      required
                  />
              </div>
              <button type="submit" className="btn btn-primary">verifier</button>
          </form>
      </div>
      </div>
  );
}

export default FactoryAuth;
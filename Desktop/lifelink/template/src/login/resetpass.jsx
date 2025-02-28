import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css"; // Assurez-vous que ce fichier est bien importé
import { Link, useNavigate, useParams } from "react-router-dom";

function ResetPass() {
  const [newpassword, setNewPassword] = useState("");
  const navigate = useNavigate()
  const {id,token} = useParams()


  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`http://localhost:3001/reset-password/${id}/${token}`, { newpassword });
  
      if (res.data.Status === "Succes") {
        alert("Votre mot de passe a été mis à jour avec succès !");
        navigate('/');
      } else {
        alert(`Erreur: ${res.data.Message || "Veuillez réessayer."}`);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du mot de passe :", err);
      alert("Erreur lors de la mise à jour du mot de passe. Vérifiez votre connexion et réessayez.");
    }
  };
  
  
  


  return (
      <div className="login-page">
      <div className="wrapper">
      <form onSubmit={handleSubmit} className="form-container">
      <h1 className="form-title">Modifier le mot de passe</h1>

              <div className="input-box">
              <input 
              type="password" 
              placeholder="New Password" 
              value={newpassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required
            />
            </div>
         
             
              
              <button type="submit" className="btn btn-primary">Update Password</button>
          </form>
      </div>
      </div>
  );
}

export default ResetPass;
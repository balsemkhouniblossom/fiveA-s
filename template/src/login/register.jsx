import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

// Icônes Font Awesome
import { FaArrowUp, FaArrowDown, FaChevronDown } from "react-icons/fa"; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, lastName, email, age, gender, phone, password } = formData;
  
    axios
      .post("http://localhost:3001/register", {
        name, // Correction ici
        lastName,
        email,
        age,
        gender,
        phone,
        password,
        role: "PATIENT", // Ajoute un rôle par défaut
      })
      .then(() => navigate("/"))
      .catch((err) => console.log(err.response?.data || err.message));
  };
  

  return (
    <div className="login-page">
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Créer un Compte</h1>
        <div className="input-box">
          <input type="text" id="name" placeholder="Prénom" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="input-box">
          <input type="text" id="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="input-box">
          <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-box">
          <input type="tel" id="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="input-box">
          <input type="number" id="age" placeholder="Âge" value={formData.age} onChange={handleChange} required />
          
        </div>
        <div className="input-box">
          <select id="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Genre</option>
            <option value="Male">Homme</option>
            <option value="Female">Femme</option>
            <option value="Other">Autre</option>
          </select>
          <div className="icon">
            <FaChevronDown />
          </div>
        </div>
        <div className="input-box">
          <input type="password" id="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="input-box">
          <input type="password" id="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" required /> J'accepte les termes et conditions
          </label>
        </div>
        <button type="submit">S'inscrire</button>
        <div className="register-link">
          <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Register;

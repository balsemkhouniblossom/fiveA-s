import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { FaChevronDown } from "react-icons/fa";

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

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    if (!/^[A-Za-zÀ-ÿ\s]{2,}$/.test(formData.name)) {
      newErrors.name = "Le prénom doit contenir au moins 2 lettres.";
    }
    if (!/^[A-Za-zÀ-ÿ\s]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = "Le nom doit contenir au moins 2 lettres.";
    }
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    if (!/^\d{10,}$/.test(formData.phone)) {
      newErrors.phone = "Le téléphone doit contenir au moins 10 chiffres.";
    }
    if (!/^\d+$/.test(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = "L'âge doit être un nombre entre 1 et 120.";
    }
    if (!formData.gender) {
      newErrors.gender = "Veuillez sélectionner un genre.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, lastName, email, age, gender, phone, password } = formData;
    axios
      .post("http://localhost:3001/register", {
        name,
        lastName,
        email,
        age,
        gender,
        phone,
        password,
        role: "PATIENT",
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
            <input type="text" id="name" placeholder="Prénom" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="input-box">
            <input type="text" id="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>

          <div className="input-box">
            <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-box">
            <input type="tel" id="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div className="input-box">
            <input type="number" id="age" placeholder="Âge" value={formData.age} onChange={handleChange} />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>

          <div className="input-box">
            <select id="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Genre</option>
              <option value="Male">Homme</option>
              <option value="Female">Femme</option>
              <option value="Other">Autre</option>
            </select>
            <div className="icon">
              <FaChevronDown />
            </div>
            {errors.gender && <p className="error">{errors.gender}</p>}
          </div>

          <div className="input-box">
            <input type="password" id="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="input-box">
            <input type="password" id="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
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

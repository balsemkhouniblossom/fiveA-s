import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setMessage("ID utilisateur introuvable !");
      setLoading(false);
      return;
    }

    console.log("ID récupéré :", id); // Debugging

    axios.get(`http://localhost:3001/users/${id}`)
      .then(response => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement :", error);
        setMessage("Erreur lors du chargement des données.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setMessage("ID utilisateur introuvable !");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/users/${id}`, formData);
      setMessage("Mise à jour réussie !");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Modifier le Profil</h1>

          {message && <p className="message">{message}</p>}

          {loading ? (
            <p>Chargement des données...</p>
          ) : (
            <>
              <div className="input-box">
                <input type="text" name="name" placeholder="Prénom" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-box">
                <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="input-box">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="input-box">
                <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="input-box">
                <input type="number" name="age" placeholder="Âge" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="input-box">
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Genre</option>
                  <option value="Male">Homme</option>
                  <option value="Female">Femme</option>
                  <option value="Other">Autre</option>
                </select>
                <div className="icon"><FaChevronDown /></div>
              </div>

              <button type="submit">Mettre à Jour</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;

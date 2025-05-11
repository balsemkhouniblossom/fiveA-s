import React, { useState } from "react";
import { FaCar, FaPhoneAlt, FaMapMarkerAlt, FaRegFlag } from "react-icons/fa";
import "./createAmbulance.css";

const CreateAmbulance = () => {
  const [model, setModel] = useState("");
  const [serie, setSerie] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!model || !serie || !contact || !location) {
      setMessage("❌ Tous les champs sont requis.");
      return;
    }

    const ambulanceData = { model, serie, contact, location, status };

    try {
      const response = await fetch("http://localhost:3001/createAmbulance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ambulanceData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Ambulance créée avec succès !");
        setModel("");
        setSerie("");
        setContact("");
        setLocation("");
        setStatus("AVAILABLE");
      } else {
        setMessage(`❌ Erreur : ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Erreur serveur, veuillez réessayer !");
    }
  };

  return (
    <div className="create-ambulance-container">
      <h1 className="create-ambulance-title">Créer Ambulance</h1>
      {message && <p className="create-ambulance-message">{message}</p>}
      <form onSubmit={handleSubmit} className="create-ambulance-form">
        <div className="create-ambulance-input-box">
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
          <FaCar className="create-ambulance-icon" />
        </div>

        <div className="create-ambulance-input-box">
          <input
            type="text"
            placeholder="Serie"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
            required
          />
        </div>

        <div className="create-ambulance-input-box">
          <input
            type="text"
            placeholder="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <FaPhoneAlt className="create-ambulance-icon" />
        </div>

        <div className="create-ambulance-input-box">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <FaMapMarkerAlt className="create-ambulance-icon" />
        </div>

        <div className="create-ambulance-input-box">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
          </select>
          <FaRegFlag className="create-ambulance-icon" />
        </div>

        <button type="submit" className="create-ambulance-button">
          Créer Ambulance
        </button>
      </form>
    </div>
  );
};

export default CreateAmbulance;

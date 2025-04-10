import React, { useState } from "react";
import { FaCar, FaPhoneAlt, FaMapMarkerAlt, FaRegFlag } from "react-icons/fa";
import "./ambulance.css"; 

const CreateAmbulance = () => {
  const [model, setModel] = useState("");
  const [serie, setSerie] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div className="login-page">
      <div className="wrapper">
        <h1>Create Ambulance</h1>
        {message && <p className="message">{message}</p>}
        <div className="user-grid">
          <div className="user-card">
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
                <FaCar className="icon" />
              </div>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Serie"
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
                  required
                />
              </div>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                <FaPhoneAlt className="icon" />
              </div>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <FaMapMarkerAlt className="icon" />
              </div>

              <div className="input-box">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="role-select"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                </select>
                <FaRegFlag className="icon" />
              </div>

              <button type="submit" className="btn-primary">
                Create Ambulance
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAmbulance;

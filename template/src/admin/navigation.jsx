import React, { useState } from "react";
import { User } from "./user"; 

export const Navigation = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  // Fonction pour afficher le bon composant
  const renderContent = () => {
    switch (selectedMenu) {
      case "user":
        return <User />;
      case "doctor":
        return <h1>Liste des docteurs</h1>;
      case "patient":
        return <h1>Liste des patients</h1>;
      case "nurse":
        return <h1>Liste des infirmiers</h1>;
      case "material":
        return <h1>Gestion du matériel</h1>;
      case "operation":
        return <h1>Opérations en cours</h1>;
      case "room":
        return <h1>Gestion des chambres</h1>;
      case "ambulance":
        return <h1>Personnel des ambulances</h1>;
      default:
        return <h1>Bienvenue sur le Dashboard</h1>;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Navigation */}
      <nav
        style={{
          width: "250px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
          position: "fixed",
          height: "100%",
          top: 0,
          left: 0,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="img/logo.jpg"
            alt="Logo"
            style={{
              width: "80%",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Menu Items */}
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("user")} style={linkStyle}>
              User
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("doctor")} style={linkStyle}>
              Doctor
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("patient")} style={linkStyle}>
              Patient
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("nurse")} style={linkStyle}>
              Nurse
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("material")} style={linkStyle}>
              Material
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("operation")} style={linkStyle}>
              Operation
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("room")} style={linkStyle}>
              Room
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button onClick={() => setSelectedMenu("ambulance")} style={linkStyle}>
              Ambulance Staff
            </button>
          </li>
          <li style={{ margin: "10px 0" }}>
            <button style={logoutStyle}>Log out</button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div style={{ marginLeft: "250px", padding: "20px", flexGrow: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
};

// Styles
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  display: "block",
  padding: "10px",
  borderRadius: "5px",
  backgroundColor: "transparent",
  border: "none",
  textAlign: "left",
  width: "100%",
  cursor: "pointer",
};

const logoutStyle = {
  ...linkStyle,
  backgroundColor: "#e74c3c",
  textAlign: "center",
};

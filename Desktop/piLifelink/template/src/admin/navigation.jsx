import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { User } from "./user";
import { DoctorFilter } from "./doctorfilter";
import { FilterNurse } from "./nursefilter";
import { Patinetfilter } from "./patientfilter";
import Ambulance from "./ambulance";
import CreateAmbulance from "./createAmbulance";
import Materiel from "./Materiel";
import Operation from "../medecin/Operation";
import Room from "./room";
import AddOperation from "./AddOperation";
import Map from "./map";
import Complaint from "./Complaint";

export const Navigation = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [ambulanceView, setAmbulanceView] = useState("list");
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    console.log("Stored User ID in localStorage:", storedUserId); // Debugging
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  const Logout = () => {
    console.log("Déconnexion en cours...");
    window.localStorage.removeItem("isLogedIn");
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("userId");

    console.log("isLogedIn supprimé:", localStorage.getItem("isLogedIn"));
    navigate("/");
  };

  const handleUserClick = (e) => {
    e.preventDefault();
    if (userId) {
      console.log("User ID:", userId); // Log the user ID to the console
      navigate(`/showProfile/${userId}`);
    } else {
      console.error("User ID not found");
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "user":
        return <User className="page-scroll" />;
      case "doctor":
        return <DoctorFilter className="page-scroll" />;
      case "patient":
        return <Patinetfilter />;
    
        case "material":
          return <Materiel className="page-scroll" />;
          case "complaint":
          return <Complaint className="page-scroll" />;
          
         case "operation":
          return <AddOperation className="page-scroll" ></AddOperation>
      case "room":
        return <Room className="page-scroll" ></Room>;
        case "Map":
          return (
            <div style={{ height: "calc(100vh - 40px)", width: "100%" }}>
              <Map className="page-scroll" />
            </div>
          );
      case "ambulance":
        return (
          <div>
            <div style={{ marginBottom: "15px" }}>
              <button
                onClick={() => setAmbulanceView("list")}
                style={{
                  padding: "10px 15px",
                  marginRight: "10px",
                  backgroundColor: ambulanceView === "list" ? "#3498db" : "#bdc3c7",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Liste des ambulances
              </button>
              <button
                onClick={() => setAmbulanceView("add")}
                style={{
                  padding: "10px 15px",
                  backgroundColor: ambulanceView === "add" ? "#2ecc71" : "#bdc3c7",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Ajouter une ambulance
              </button>
            </div>
            {ambulanceView === "list" ? <Ambulance /> : <CreateAmbulance />}
          </div>
        );
      default:
        return <h1>Bienvenue sur le Dashboard</h1>;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh",overflowY: "auto" }}>
<nav style={{ width: "250px", backgroundColor: "#2c3e50", color: "white", padding: "20px", position: "fixed", height: "100%", top: 0, left: 0, overflowY: "auto" }}>        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", fontSize: "18px" }}>
          <a href="#" onClick={handleUserClick}>
            <FaUserCircle size={20} style={{ marginRight: "5px" }} /> {userName}
          </a>
        </div>

        <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px" }}>
          <li><button onClick={() => setSelectedMenu("user")} style={linkStyle}>User</button></li>
          <li><button onClick={() => setSelectedMenu("doctor")} style={linkStyle}>Doctors</button></li>
          <li><button onClick={() => setSelectedMenu("patient")} style={linkStyle}>Patient</button></li>
          <li><button onClick={() => setSelectedMenu("material")} style={linkStyle}>Material</button></li>
          <li><button onClick={() => setSelectedMenu("complaint")} style={linkStyle}>Complaints</button></li>

          <li><button onClick={() => setSelectedMenu("operation")} style={linkStyle}>Operation</button></li>
          <li><button onClick={() => setSelectedMenu("Map")} style={linkStyle}>Emergency Map</button></li>

          <li><button onClick={() => setSelectedMenu("room")} style={linkStyle}>Room</button></li>
          <li><button onClick={() => setSelectedMenu("ambulance")} style={linkStyle}>Ambulance Staff</button></li>
          <li><button style={logoutStyle} onClick={Logout}>Log out</button></li>
        </ul>
      </nav>


      <div style={{ 
        marginLeft: "250px", 
        padding: "20px", 
        flexGrow: 1,
        height: "100vh",
        overflowY: "auto" // Cette propriété est essentielle pour permettre le défilement
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

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
  overflowY: "auto"
};

const logoutStyle = {
  ...linkStyle,
  backgroundColor: "#e74c3c",
  textAlign: "center",
  overflowY: "auto"
};

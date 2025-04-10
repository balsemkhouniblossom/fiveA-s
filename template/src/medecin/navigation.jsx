import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navigation.css";
import DoctorCalendar from './doctorCalendar';
import Operation from './Operation';

export const Navigation = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home"); // Ajout de selectedMenu

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserName) setUserName(storedUserName);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const Logout = () => {
    localStorage.removeItem("isLogedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleUserClick = (e) => {
    e.preventDefault();
    if (userId) navigate(`/showProfile/${userId}`);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "appointment":
        return <DoctorCalendar />;
      case "profile":
        return <div>Profil de l'utilisateur #{userId}</div>;
      case "liste":
        return <div>Liste des patients</div>;
      case "operations":
        return <Operation />;
      case "schedule":
        return <div>Composant Schedule ici</div>;
      case "chatbot":
        return <div>Composant Chatbot ici</div>;
      default:
        return <div>Bienvenue ! Sélectionnez un menu.</div>;
    }
  };

  return (
    <>
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("operations")}>
                  Operations
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("appointment")}>
                  Appointment
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("schedule")}>
                  Schedule
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("liste")}>
                  List Patients
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("chatbot")}>
                  Chatbot
                </a>
              </li>
              <li>
                <button className="logout-button" onClick={Logout}>Log out</button>
              </li>
              <li className="nav-user">
                <a href="#" onClick={handleUserClick} className="nav-item">
                  <FaUserCircle size={40} className="user-icon" /> {userName}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: "80px", padding: "20px" }}>
        {renderContent()}
      </div>
    </>
  );
};

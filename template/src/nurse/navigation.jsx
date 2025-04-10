import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Appointment from "./appointment";
// Ajoute ici d'autres composants comme Operation, Schedule, etc. selon tes besoins

export const Navigation = () => {
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");

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
    window.location.href = "/"; // Redirige vers la page d'accueil après la déconnexion
  };

  const handleUserClick = (e) => {
    e.preventDefault();
    if (userId) {
      // Affiche ici un composant de profil si besoin
      setSelectedMenu("profile");
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "appointment":
        return <Appointment />;
      case "profile":
        return <div>Profil de l'utilisateur #{userId}</div>;
      case "operations":
        return <div>Composant Operations ici</div>;
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
      <nav id="menu" className="navbar navbar-default navbar-fixed-top">
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
            <a href="#" className="navbar-brand">
              <img
                src="img/logo.jpg"
                alt="Logo"
                style={{
                  height: "50px",
                  display: "inline-block",
                  verticalAlign: "middle",
                  marginLeft: "-70px",
                }}
              />
            </a>
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
                  Patients
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("schedule")}>
                  Schedule
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("chatbot")}>
                  Chatbot
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={Logout}>
                  Log out
                </a>
              </li>
              <li className="nav-user">
                <a href="#" onClick={handleUserClick}>
                  <FaUserCircle size={20} style={{ marginRight: "5px" }} /> {userName}
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

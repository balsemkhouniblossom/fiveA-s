import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navigation.css";
import DoctorCalendar from "./doctorCalendar";
import Operation from "./Operation";
import MesRdvMedecin from "./MesRdvMedecin";
import OperationAndDoctorCalendar from "./OperationAndDoctorCalendar";
import Patients from "./Patients";
import { Homepage } from "./homepage";

export const Navigation = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");

    if (storedUserName) setUserName(storedUserName);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const userID= localStorage.getItem("userId")

  const Logout = () => {
    localStorage.removeItem("isLogedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleListPatientsClick = () => {
    if (userId) {
      navigate(`/listPatients/${userId}`);
    }
  };

  const handleUserClick = (e) => {
    e.preventDefault();
    if (userId) navigate(`/showProfile/${userId}`);
  };

  const renderContent = () => {
    if (!userId) {
      return <p>Veuillez vous connecter pour accéder à votre espace.</p>;
    }

    switch (selectedMenu) {
      case "home":
        return <Homepage />;
      case "appointment":
        return <DoctorCalendar doctorId={userId} />;
      case "profile":
        return <div>Profil de l'utilisateur #{userId}</div>;
      case "operations":
        return <Operation doctorId={userID} />;
      case "Rendez-vous":
        return <MesRdvMedecin doctorId={userId} />;
      case "schedule":
        return <OperationAndDoctorCalendar doctorId={userId} />;
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
              data-target="#navbar-collapse"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("home")}>
                  Home
                </a>
              </li>
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
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("Rendez-vous")}>
                  Rendez-vous
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={() => setSelectedMenu("schedule")}>
                  Schedule
                </a>
              </li>
              <li>
                <a href="#" className="page-scroll" onClick={Logout}>
                  Logout
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

      <div style={{ marginTop: "80px", padding: "20px" }}>{renderContent()}</div>
    </>
  );
};

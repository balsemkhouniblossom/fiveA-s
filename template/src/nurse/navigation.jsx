import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import {Appointment} from "./appointment"

export const Navigation = (props) => {
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

    const handleAppointmentClick = (e) => {
            navigate("/appointment");
    };
    
    
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a href="#" className="navbar-brand">
            <img
              src="img/logo.jpg"
              alt="Logo"
              style={{
                height: "50px",
                display: "inline-block",
                verticalAlign: "middle",
                marginLeft: "-70px", // Ajustement si nécessaire

              }}
            />
          </a>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Operations
              </a>
            </li>
            <li>
              <a href="#Appointment" className="page-scroll"  onClick={handleAppointmentClick}>
                Patients
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Schedule
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll">
                Chatbot
              </a>
            </li>
            <li>
            <a href="#" className="page-scroll" onClick={()=>Logout()}>
                log out
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
  );
};

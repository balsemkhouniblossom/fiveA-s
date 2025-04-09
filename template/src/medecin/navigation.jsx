import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navigation.css";

export const Navigation = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [userId, setUserId] = useState(null);

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

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <img src="img/logo.jpg" alt="Logo" className="logo" />
        </div>
        <ul className="nav-links">
        <li>
            <a
              className="nav-item"
              href={`/operationDoctor/${userId}`}
            >
              Operations
            </a>
          </li>
          <li><a href="#about" className="nav-item">Appointment</a></li>
          <li>
            <a href={`/doctorCalendar/${userId}`} className="nav-item">Schedule</a>
          </li>
          <li><a href="#portfolio"className="nav-item">List Patients</a></li>
          <li><a href="#testimonials" className="nav-item">Chatbot</a></li>
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
    </nav>
  );
};

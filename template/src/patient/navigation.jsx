import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

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
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
      
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Emergency
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                List Appointments
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll">
                Health History
              </a>
            </li>
            <li>
              <a href="#testimonials" className="page-scroll">
                Chatbot
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
  );
};

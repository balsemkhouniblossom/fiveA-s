import React from "react";

export const Navigation = (props) => {
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
            <a href="#features" style={linkStyle}>
              Emergency
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a href="#about" style={linkStyle}>
              Appointment
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a href="#services" style={linkStyle}>
              List Appointments
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a href="#portfolio" style={linkStyle}>
              Health History
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a href="#testimonials" style={linkStyle}>
              Chatbot
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a href="#contact" style={linkStyle}>
              Complaints
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a href="#" style={logoutStyle}>
              Log out
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div style={{ marginLeft: "250px", padding: "20px", flexGrow: 1 }}>
        <h1>Dashboard Content Here</h1>
        <p>Welcome to the admin dashboard.</p>
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
};

const logoutStyle = {
  ...linkStyle,
  backgroundColor: "#e74c3c",
  textAlign: "center",
};

import React from "react";

export const Navigation = (props) => {
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
                Emergency
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                Appointment
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
              <a href="#contact" className="page-scroll">
                Complaints
              </a>
            </li>
            <li>
              <a href="#" className="page-scroll">
                Log out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/login", { email, password })
      .then(result => {
        console.log(result)
        if (result.data === "Success") {
          navigate("/home");
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 w-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="bg-white p-5 rounded shadow-lg w-100" style={{ maxWidth: "800px" }}>
        <h2 className="text-center mb-4 fs-3">Login</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          <div>
            <label htmlFor="email" className="fs-5"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control p-4 fs-5"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="fs-5"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="form-control p-4 fs-5"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 p-4 fs-4">Login</button>
        </form>
        <p className="text-center mt-4 fs-5">Don't have an account?</p>
        <br></br>
        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/register" className="btn btn-outline-primary w-100 p-4 fs-4">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });

      console.log("Response Data:", response.data);

      if (response.data.role) {
        const { role } = response.data;
        localStorage.setItem("role", role);

        if (role === "ADMIN") {
          navigate("/dashboard");
        } else if(role === "PATIENT"){
          navigate("/patient");
        }else if(role === "DOCTOR"){
          navigate("/doctor");
        }else if(role === "NURSE"){
          navigate("/nurse");
        }
      } else {
        alert("Rôle utilisateur non défini. Veuillez contacter l'administrateur.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message || "Email ou mot de passe incorrect."
      );
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src={`${process.env.PUBLIC_URL}/images/loginhost.jpg`}
            className="img-fluid"
            alt="Sample"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <p className="lead fw-normal mb-0 me-3">Sign in with</p>

            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="facebook-f" />
            </MDBBtn>

            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="twitter" />
            </MDBBtn>

            <MDBBtn floating size="md" tag="a" className="me-2">
              <MDBIcon fab icon="linkedin-in" />
            </MDBBtn>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>

          {/* Ajout des onChange pour stocker les valeurs */}
          <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            id="email"
            type="email"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="password"
            type="password"
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
            />
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn className="mb-0 px-5" size="lg" onClick={handleSubmit}>
              Login
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Don't have an account?{" "}
              <Link to="/register" className="link-danger">
                Register
              </Link>
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Signin;

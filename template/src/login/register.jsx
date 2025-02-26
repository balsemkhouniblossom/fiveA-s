import React, { useState } from "react";
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox, MDBRadio } from "mdb-react-ui-kit";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, age, gender, phone, password } = formData;
    axios.post('http://localhost:3001/register', {
      firstName, lastName, email, age, gender, phone, password
    })
    .then((result) => {
      console.log(result);
      navigate('/login');
    })
    .catch(err => console.log(err));
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        {/* Image à gauche */}
        <MDBCol col="10" md="6">
          <img src={`${process.env.PUBLIC_URL}/images/loginhost.jpg`} className="img-fluid" alt="Sample image" />
        </MDBCol>

        {/* Formulaire à droite */}
        <MDBCol col="4" md="6">
          <h3 className="mb-4">Create an Account</h3>

          <form onSubmit={handleSubmit}>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput wrapperClass="mb-4" label="First Name" id="firstName" type="text" size="lg" value={formData.firstName} onChange={handleChange} />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput wrapperClass="mb-4" label="Last Name" id="lastName" type="text" size="lg" value={formData.lastName} onChange={handleChange} />
              </MDBCol>
            </MDBRow>

            <MDBInput wrapperClass="mb-4" label="Email" id="email" type="email" size="lg" value={formData.email} onChange={handleChange} />
            <MDBInput wrapperClass="mb-4" label="Phone Number" id="phone" type="tel" size="lg" value={formData.phone} onChange={handleChange} />
            <MDBInput wrapperClass="mb-4" label="Age" id="age" type="number" size="lg" value={formData.age} onChange={handleChange} />

            {/* Genre */}
            <div className="mb-4">
              <label className="mb-2 d-block">Gender:</label>
              <MDBRadio name="gender" id="male" label="Male" inline onChange={() => setFormData({ ...formData, gender: "Male" })} />
              <MDBRadio name="gender" id="female" label="Female" inline onChange={() => setFormData({ ...formData, gender: "Female" })} />
              <MDBRadio name="gender" id="other" label="Other" inline onChange={() => setFormData({ ...formData, gender: "Other" })} />
            </div>

            <MDBInput wrapperClass="mb-4" label="Password" id="password" type="password" size="lg" value={formData.password} onChange={handleChange} />
            <MDBInput wrapperClass="mb-4" label="Confirm Password" id="confirmPassword" type="password" size="lg" value={formData.confirmPassword} onChange={handleChange} />

            <div className="d-flex justify-content-between mb-4">
              <MDBCheckbox name="terms" value="" id="terms" label="I agree to the terms and conditions" />
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <MDBBtn className="mb-0 px-5" size="lg" type="submit">Register</MDBBtn>
              <p className="small fw-bold mt-2 pt-1 mb-2">
                Already have an account? <Link to="/" className="link-danger">Sign in</Link>
              </p>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;

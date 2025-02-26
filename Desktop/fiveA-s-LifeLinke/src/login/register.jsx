import React from "react";
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox, MDBRadio } from "mdb-react-ui-kit";
import { Link } from 'react-router-dom';

const Register = () => {
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

          <MDBRow>
            <MDBCol md="6">
              <MDBInput wrapperClass="mb-4" label="First Name" id="firstName" type="text" size="lg" />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput wrapperClass="mb-4" label="Last Name" id="lastName" type="text" size="lg" />
            </MDBCol>
          </MDBRow>

          <MDBInput wrapperClass="mb-4" label="Email" id="email" type="email" size="lg" />
          <MDBInput wrapperClass="mb-4" label="Phone Number" id="phone" type="tel" size="lg" />
          <MDBInput wrapperClass="mb-4" label="Age" id="age" type="number" size="lg" />

          {/* Genre */}
          <div className="mb-4">
            <label className="mb-2 d-block">Gender:</label>
            <MDBRadio name="gender" id="male" label="Male" inline />
            <MDBRadio name="gender" id="female" label="Female" inline />
            <MDBRadio name="gender" id="other" label="Other" inline />
          </div>

         
          <MDBInput wrapperClass="mb-4" label="Role" id="role" type="text" size="lg" />

         
          <MDBInput wrapperClass="mb-4" label="Password" id="password" type="password" size="lg" />
          <MDBInput wrapperClass="mb-4" label="Confirm Password" id="confirmPassword" type="password" size="lg" />

       
          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox name="terms" value="" id="terms" label="I agree to the terms and conditions" />
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn className="mb-0 px-5" size="lg">Register</MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Already have an account? <Link to="/" className="link-danger">Sign in</Link>
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;

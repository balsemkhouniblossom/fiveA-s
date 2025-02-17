import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [name, setName]= useState()
    const [email, setEmail]= useState()
    const [password, setPassword]= useState()
    const navigate = useNavigate()

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/register',{name, email, password})
        .then(result=>console.log(result))
        navigate('/login')
        .catch(err=> console.log(err))
    }
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="bg-white p-5 rounded shadow-lg w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name"><strong>Name</strong></label>
            <input type="text" placeholder="Enter Name" autoComplete="off" name="name" className="form-control" onChange={(e)=> setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" placeholder="Enter Email" autoComplete="off" name="email" className="form-control" onChange={(e)=> setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" placeholder="Enter Password" autoComplete="off" name="password" className="form-control" onChange={(e)=> setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-success w-100 mt-3">Register</button>
          <p className="text-center mt-2">Already Have an Account?</p>
          <Link to="/login" className='btn btn-outline-primary w-100'>Login</Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;

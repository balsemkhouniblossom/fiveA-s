import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


function ForgotPassword() {
    const [email, setEmail] = useState()
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/forgot-password', {email})
        .then(res => {
            if(res.data.Status === "Success") {
              navigate('/login')
            }
        }).catch(err => console.log(err))
    }

    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-4 rounded w-50">
                <h4 className="mb-4">Forgot Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control form-control-lg"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 btn-lg">
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;

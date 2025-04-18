import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Forgetpass() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await axios.post("http://localhost:3001/forgot-password", { email });

            if (res.data.Status === "Success") {
                setMessage("Email de réinitialisation envoyé !");
                setTimeout(() => navigate("/login"), 3000); // Redirige après 3 secondes
            } else {
                setError(res.data.Status || "Erreur inconnue");
            }
        } catch (err) {
            setError("Une erreur s'est produite, veuillez réessayer.");
            console.error(err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-4 rounded w-50">
                <h4 className="mb-4">Forgot Password</h4>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
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
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 btn-lg">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Forgetpass;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css"; // Importer le fichier CSS

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
        <div className="wrapper">
            <form onSubmit={handleSubmit} className="form-container">
                <h1 className="form-title">Réinitialiser le mot de passe</h1>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Entrez votre email"
                        autoComplete="off"
                        name="email"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Envoyer</button>
            </form>
        </div>
    );
}

export default Forgetpass;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importez useNavigate
import "./../admin/user.css";

export const Medecins = () => {
  const { specialite } = useParams();
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Créez une instance de navigate

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/medecins/${specialite}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des médecins');
        }

        const data = await response.json();
        setMedecins(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedecins();
  }, [specialite]);

  const handleReserve = (idMedecin) => {
    // Redirige vers la page Rdv avec l'ID du médecin dans l'URL
    navigate(`/rdv/${idMedecin}`);
  };

  return (
    <div className="container">
      <h2>Liste des Médecins en {specialite}</h2>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="user-grid">
        {medecins.length === 0 ? (
          <p>Aucun médecin trouvé pour cette spécialité.</p>
        ) : (
          medecins.map((medecin) => (
            <div key={medecin._id} className="user-card">
              <h3>{medecin.nom} {medecin.prenom}</h3>
              <p className="user-info">Spécialité: {medecin.speciality}</p>
              <p className="user-info">Email: {medecin.email}</p>

              {/* Bouton de réservation */}
              <button onClick={() => handleReserve(medecin._id)}>
                <span>Reserve</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

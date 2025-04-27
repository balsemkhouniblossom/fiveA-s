import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ajoutez useNavigate
import axios from 'axios';

const MesRdv = () => {
  const { userId } = useParams(); 
  const [appointments, setAppointments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/appointments/patient/${userId}`);
        
        // Vérification que la réponse est un tableau et non un objet avec une clé 'appointments'
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAppointments(response.data); // Stocker les rendez-vous si la réponse est valide
        } else {
          console.warn("Aucun rendez-vous trouvé pour cet utilisateur");
          setAppointments([]); // Si aucune donnée n'est trouvée, on met un tableau vide
        }
        setLoading(false); // Fin du chargement
      } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        setLoading(false); // Fin du chargement en cas d'erreur
      }
    };
  
    fetchAppointments();
  }, [userId]);

  const handleNavigate = () => {
    // Redirige vers la page historique du patient
    navigate(`/${userId}/historique`);
  };

  if (loading) {
    return <div>Chargement des rendez-vous...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Mes Rendez-vous</h2>

      {/* Afficher un message si aucun rendez-vous n'est trouvé */}
      {appointments.length === 0 ? (
        <p>Aucun rendez-vous trouvé pour cet utilisateur.</p>
      ) : (
        <div>
          {/* Affichage des rendez-vous */}
          {appointments.map((rdv, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
              }}
            >
              <h3>Rendez-vous {index + 1}</h3>
              <p><strong>Start Time:</strong> {new Date(rdv.startTime).toLocaleString()}</p>
              <p><strong>End Time:</strong> {new Date(rdv.endTime).toLocaleString()}</p>
              <p><strong>Status:</strong> {rdv.status}</p>
              <p><strong>Doctor:</strong> {rdv.doctor.name} {rdv.doctor.lastName}</p> {/* Affichage des informations du médecin */}
            </div>
          ))}
        </div>
      )}

      {/* Boutons pour naviguer */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleNavigate}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Voir l'historique
        </button>

        {/* Ajouter un autre bouton avec une fonctionnalité différente */}
        
      </div>
    </div>
  );
};

export default MesRdv;

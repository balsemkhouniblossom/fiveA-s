import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MesRdv = () => {
  const { userId } = useParams(); // Récupérer l'ID du patient depuis les paramètres
  const [appointments, setAppointments] = useState([]); // Stocker les rendez-vous récupérés
  const [loading, setLoading] = useState(true); // Gérer l'état de chargement

  // Récupérer les rendez-vous du patient lors du chargement du composant
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
    </div>
  );
};

export default MesRdv;

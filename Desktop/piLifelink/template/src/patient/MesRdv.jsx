import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mesrdv.css';  // Import the CSS file

const MesRdv = () => {
  const { userId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/appointments/patient/${userId}`);
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleNavigate = () => {
    navigate(`/${userId}/historique`);
  };

  if (loading) {
    return <div className="loading">Chargement des rendez-vous...</div>;
  }

  return (
      <div className="mesrdv-container">
  {/* Back button at the top-right */}
  <div className="top-bar">
    <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>
  </div>


      <h2 className="title">Mes Rendez-vous</h2>

      {appointments.length === 0 ? (
        <p className="no-appointments">Aucun rendez-vous trouvé pour cet utilisateur.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((rdv, index) => (
            <div key={index} className="appointment-card">
              <h3>Appointment</h3>
              <p>
                <span className="icon">
                  📅
                </span>
                <strong> Start:</strong> {new Date(rdv.startTime).toLocaleString()}
              </p>
              <p>
                <span className="icon">
                  🕒
                </span>
                <strong> End:</strong> {new Date(rdv.endTime).toLocaleString()}
              </p>
              <p>
                <span className="icon">✅</span>
                <strong> {rdv.status.charAt(0).toUpperCase() + rdv.status.slice(1)}</strong>
              </p>
              <p>
                <span className="icon">👨‍⚕️</span>
                <strong> Doctor:</strong> {rdv.doctor.name} {rdv.doctor.lastName}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="buttons-container">
        <button onClick={handleNavigate} className="btn-view-history">
          Voir l'historique
        </button>
      </div>
    </div>
  );
};

export default MesRdv;
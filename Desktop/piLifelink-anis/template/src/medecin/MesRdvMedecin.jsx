import React, { useEffect, useState } from "react";
import axios from "axios";
import './Appointments.css';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:3001/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Erreur de récupération des rendez-vous :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3001/appointments/${appointmentId}/status`, {
        status: newStatus,
      });

      if (response.status !== 200) throw new Error("Erreur lors de la mise à jour du statut");

      if (newStatus === "cancelled") {
        await handleDeleteAppointment(appointmentId);
      } else {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId ? { ...appointment, status: newStatus } : appointment
          )
        );
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/appointments/${appointmentId}`);

      if (response.status !== 200) throw new Error("Erreur lors de la suppression");

      setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment._id !== appointmentId));
      alert(response.data.message);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert(`Erreur : ${error.message}`);
    }
  };

  const pendingAppointments = appointments.filter((appointment) => appointment.status === "pending");

  return (
    <div className="container">
      <h2 className="text-center">Liste des Rendez-vous (En attente)</h2>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="appointment-grid">
          {pendingAppointments.length > 0 ? (
            pendingAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <h3>{appointment.patient?.name} {appointment.patient?.lastName}</h3>
                <p className="appointment-info">Médecin: {appointment.doctor?.name} {appointment.doctor?.lastName}</p>
                <p className="appointment-info">Début: {new Date(appointment.startTime).toLocaleString()}</p>
                <p className="appointment-info">Fin: {new Date(appointment.endTime).toLocaleString()}</p>
                <p className="appointment-info">Statut Actuel : {appointment.status}</p>

                <div className="status-selection">
                  <label>Statut</label>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun rendez-vous en attente trouvé</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;

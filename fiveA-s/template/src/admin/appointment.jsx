import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import './appoitement.css'; // Importation du fichier CSS

function Appointment() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [status, setStatus] = useState("pending");
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/patients")
      .then(res => setPatients(res.data))
      .catch(error => console.error("Erreur de chargement des patients", error));

    axios.get("http://localhost:3001/api/doctors")
      .then(res => setDoctors(res.data))
      .catch(error => console.error("Erreur de chargement des médecins", error));

    axios.get("http://localhost:3001/appointments")
      .then(res => Array.isArray(res.data) ? setAppointments(res.data) : console.error("Format incorrect", res.data))
      .catch(error => console.error("Erreur de chargement des rendez-vous", error));
  }, []);

  const addAppointment = () => {
    if (!patient || !doctor) {
      alert("Veuillez sélectionner un patient et un médecin.");
      return;
    }

    const newAppointment = { startTime, endTime, status, patient, doctor };

    axios.post("http://localhost:3001/appointments", newAppointment)
      .then(response => {
        alert("Rendez-vous ajouté avec succès");
        setAppointments([...appointments, response.data]);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du rendez-vous :", error);
        alert("Une erreur est survenue.");
      });
  };

  return (
    <div className="appointment-container">
      <h2 className="appointment-title">Gestion des rendez-vous</h2>
      
      <div className="appointment-form">
        <div className="appointment-form-group">
          <label className="appointment-label">Heure de début</label>
          <DateTimePicker
            onChange={setStartTime}
            value={startTime}
            className="react-datetime-picker"
          />
        </div>

        <div className="appointment-form-group">
          <label className="appointment-label">Heure de fin</label>
          <DateTimePicker
            onChange={setEndTime}
            value={endTime}
            className="react-datetime-picker"
          />
        </div>

        <div className="appointment-form-group">
          <label className="appointment-label">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="appointment-select">
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="canceled">Annulé</option>
          </select>
        </div>

        <div className="appointment-form-group">
          <label className="appointment-label">Patient</label>
          <select value={patient} onChange={(e) => setPatient(e.target.value)} className="appointment-select">
            <option value="">Sélectionner un patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>
                {p.name || p.firstName ? `${p.name || p.firstName} ${p.lastName || ''}` : "Nom inconnu"}
              </option>
            ))}
          </select>
        </div>

        <div className="appointment-form-group">
          <label className="appointment-label">Médecin</label>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="appointment-select">
            <option value="">Sélectionner un médecin</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>
                {d.name || d.firstName ? `${d.name || d.firstName} ${d.lastName || ''}` : "Nom inconnu"}
              </option>
            ))}
          </select>
        </div>

        <button onClick={addAppointment} className="appointment-button">
          Ajouter le rendez-vous
        </button>
      </div>
    </div>
  );
}

export default Appointment;

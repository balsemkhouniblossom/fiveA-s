import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AddOperation.css";

function AddOperation() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [room, setRoom] = useState("");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3001/api/patients')
      .then(res => setPatients(res.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:3001/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:3001/api/rooms')
      .then(res => setRooms(res.data))
      .catch(error => console.error(error));
  }, []);

  const checkTimeConflict = async (start, end, doctorId, patientId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/check-conflict`, {
        params: { start, end, doctorId, patientId }
      });
      return response.data.conflict;
    } catch (error) {
      console.error("Error checking time conflict:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const newOperation = { startTime, endTime, description, patient, doctor, room };
    const currentTime = new Date();

    if (new Date(startTime) < currentTime) {
      setErrorMessage("Vous ne pouvez pas ajouter une opération dans le passé.");
      return;
    }

    const conflict = await checkTimeConflict(startTime, endTime, doctor, patient);
    if (conflict) {
      setErrorMessage("L'horaire choisi est déjà pris par un rendez-vous ou une autre opération.");
      return;
    }

    axios.post('http://localhost:3001/api/operations', newOperation)
      .then(() => alert("Opération ajoutée avec succès !"))
      .catch(() => alert("Erreur lors de l'ajout de l'opération"));
  };

  return (
    <div className="add-operation-container">
      <h2 className="add-operation-title">Ajouter une opération</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="add-operation-form" onSubmit={handleSubmit}>
        <div className="add-operation-form-group">
          <label className="add-operation-label">Heure de début</label>
          <input
            className="add-operation-input"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="add-operation-form-group">
          <label className="add-operation-label">Heure de fin</label>
          <input
            className="add-operation-input"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div className="add-operation-form-group">
          <label className="add-operation-label">Description</label>
          <textarea
            className="add-operation-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="add-operation-form-group">
          <label className="add-operation-label">Patient</label>
          <select
            className="add-operation-select"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
          >
            <option value="">Sélectionner un patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} {p.lastName}</option>
            ))}
          </select>
        </div>
        <div className="add-operation-form-group">
          <label className="add-operation-label">Médecin</label>
          <select
            className="add-operation-select"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          >
            <option value="">Sélectionner un médecin</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>{d.name} {d.lastName}</option>
            ))}
          </select>
        </div>
        <div className="add-operation-form-group">
          <label className="add-operation-label">Salle</label>
          <select
            className="add-operation-select"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="">Sélectionner une salle</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>{r.roomNumber}</option>
            ))}
          </select>
        </div>
        <button className="add-operation-button" type="submit">Ajouter l'opération</button>
       
      </form>
    </div>
  );
}

export default AddOperation;

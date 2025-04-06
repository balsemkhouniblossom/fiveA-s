import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function Appointment() {
  const [startTime, setStartTime] = useState(new Date());  // Nouveau champ pour l'heure de début
  const [endTime, setEndTime] = useState(new Date());  // Nouveau champ pour l'heure de fin
  const [status, setStatus] = useState("pending");
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [appointments, setAppointments] = useState([]);  // Initialiser avec un tableau vide
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/patients")
      .then(res => {
        console.log("Patients data:", res.data);
        setPatients(res.data);
      })
      .catch(error => console.error("Erreur de chargement des patients", error));
  
    axios.get("http://localhost:3001/api/doctors")
      .then(res => {
        console.log("Doctors data:", res.data);
        setDoctors(res.data);
      });  
  
    axios.get("http://localhost:3001/appointments")
      .then(res => {
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          console.error("La réponse des rendez-vous n'est pas un tableau", res.data);
        }
      })
      .catch(error => console.error("Erreur de chargement des rendez-vous", error));
  }, []); // ✅ useEffect est directement dans le composant, pas dans une fonction
  

  const addAppointment = () => {
    if (!patient || !doctor) {
      alert("Veuillez sélectionner un patient et un médecin.");
      return;
    }

    const newAppointment = { 
      startTime, 
      endTime, 
      status, 
      patient, 
      doctor
    };

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
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-center mb-4">Gestion des rendez-vous</h2>
        <div className="space-y-3">
          <label className="block font-medium">Heure de début</label>
          <DateTimePicker onChange={setStartTime} value={startTime} className="w-full border rounded-md p-2" />

          <label className="block font-medium">Heure de fin</label>
          <DateTimePicker onChange={setEndTime} value={endTime} className="w-full border rounded-md p-2" />

          <label className="block font-medium">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-md p-2">
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="canceled">Annulé</option>
          </select>

          <label className="block font-medium">Patient</label>
          <select value={patient} onChange={(e) => setPatient(e.target.value)} className="w-full border rounded-md p-2">
    <option value="">Sélectionner un patient</option>
    {patients.map(p => {
  return (
    <option key={p._id} value={p._id}>
      {p.name || p.firstName ? `${p.name || p.firstName} ${p.lastName || ''}` : "Nom inconnu"}
    </option>
  );
})}

</select>


          <label className="block font-medium">Médecin</label>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="w-full border rounded-md p-2">
            <option value="">Sélectionner un médecin</option>
            {doctors.map(d => {
              return (
    <option key={d._id} value={d._id}>
      {d.name || d.firstName ? `${d.name || d.firstName} ${d.lastName || ''}` : "Nom inconnu"}
      </option>
  );
})}
          </select>
        </div>
        <button onClick={addAppointment} className="w-full bg-blue-500 text-white rounded-md py-2 mt-4 hover:bg-blue-600 transition">Ajouter le rendez-vous</button>
      </div>

      <div className="mt-6 w-96">
        <h3 className="text-lg font-bold text-center">Liste des rendez-vous</h3>
        <ul className="mt-3 space-y-2">
  {Array.isArray(appointments) && appointments.length > 0 ? (
    appointments.map(appt => (
      <li key={appt._id} className="bg-white shadow-md p-4 rounded-lg border">
        <p><strong>Patient :</strong> {appt.patient ? `${appt.patient.name} ${appt.patient.lastName}` : 'Nom inconnu'}</p>
        <p><strong>Médecin :</strong> {appt.doctor ? `${appt.doctor.name} ${appt.doctor.lastName} - ${appt.doctor.specialty}` : 'Nom inconnu'}</p>
        <p><strong>Heure de début :</strong> {new Date(appt.startTime).toLocaleTimeString()}</p>
        <p><strong>Heure de fin :</strong> {new Date(appt.endTime).toLocaleTimeString()}</p>
        <p><strong>Statut :</strong> {appt.status}</p>
      </li>
    ))
  ) : (
    <p>Aucun rendez-vous disponible.</p>
  )}
</ul>

      </div>
    </div>
  );
}

export default Appointment;

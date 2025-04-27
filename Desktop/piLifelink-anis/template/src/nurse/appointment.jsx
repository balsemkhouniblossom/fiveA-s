import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function Appointment() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [status, setStatus] = useState("pending");
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:3001/api/patients"),
          axios.get("http://localhost:3001/api/doctors"),
          axios.get("http://localhost:3001/appointments")
        ]);

        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
        if (Array.isArray(appointmentsRes.data)) {
          setAppointments(appointmentsRes.data);
        } else {
          throw new Error("La réponse des rendez-vous n'est pas un tableau");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addAppointment = () => {
    if (!patient || !doctor) {
      alert("Veuillez sélectionner un patient et un médecin.");
      return;
    }

    if (endTime <= startTime) {
      alert("L'heure de fin doit être après l'heure de début.");
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Chargement...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Erreur: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Gestion des Rendez-vous</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Heure de début</label>
            <DateTimePicker onChange={setStartTime} value={startTime} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Heure de fin</label>
            <DateTimePicker onChange={setEndTime} value={endTime} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="canceled">Annulé</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Patient</label>
            <select value={patient} onChange={(e) => setPatient(e.target.value)} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner un patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name || p.firstName ? `${p.name || p.firstName} ${p.lastName || ''}` : "Nom inconnu"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Médecin</label>
            <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner un médecin</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>
                  {d.name || d.firstName ? `${d.name || d.firstName} ${d.lastName || ''}` : "Nom inconnu"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={addAppointment} className="w-full bg-blue-500 text-white rounded-md py-2 mt-6 hover:bg-blue-600 transition">Ajouter le rendez-vous</button>
      </div>
    </div>
  );
}

export default Appointment;

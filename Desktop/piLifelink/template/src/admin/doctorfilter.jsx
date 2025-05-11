import React, { useState, useEffect } from "react";
import axios from "axios";
import './DoctorFilter.css';

export const DoctorFilter = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/doctors");
      setDoctors(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des médecins");
      console.error("Erreur lors du chargement :", err);
    }
    setLoading(false);
  };

  const affectSpecialty = async (userId, newSpeciality) => {
    try {
      const response = await fetch(`http://localhost:3001/doctor/${userId}/speciality`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speciality: newSpeciality }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour de la spécialité");

      const updatedDoctor = await response.json();

      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === userId ? { ...doctor, speciality: updatedDoctor.speciality } : doctor
        )
      );
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const filteredDoctors = selectedSpeciality
    ? doctors.filter((doctor) => doctor.speciality === selectedSpeciality)
    : doctors;

  return (
    <div className="container">
      <div className="section-title text-center">
        <h2>Liste des Médecins</h2>
      </div>

      <div className="filter-container text-center">
        <label>Filtrer par spécialité :</label>
        <select
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes</option>
          <option value="Cardiologie">Cardiologie</option>
          <option value="Neurologie">Neurologie</option>
          <option value="Pédiatrie">Pédiatrie</option>
          <option value="Gynécologie-obstétrique">Gynécologie-obstétrique</option>
          <option value="Traumatologie">Traumatologie</option>
          <option value="Pneumologie">Pneumologie</option>
          <option value="Néphrologie">Néphrologie</option>
          <option value="Gastro-entérologie">Gastro-entérologie</option>
          <option value="Oncologie">Oncologie</option>
          <option value="Psychiatrie">Psychiatrie</option>
          <option value="Radiologie">Radiologie</option>
          <option value="Anesthésie-réanimation">Anesthésie-réanimation</option>
        </select>
      </div>

      <div className="row">
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, i) => (
            <div key={`${doctor.name}-${i}`} className="user-card">
              <div className="testimonial">
                <div className="testimonial-image">
                  <img src="/images/doctor.png" alt={doctor.name} />
                </div>
                <div className="testimonial-content">
                  <h4>
                    {doctor.name} {doctor.lastName}
                  </h4>
                  <div className="speciality-selection">
                    <label>Spécialité</label>
                    <select
                      value={doctor.speciality || ""}
                      onChange={(e) => affectSpecialty(doctor._id, e.target.value)}
                      className="role-select"
                    >
                      <option value="">Aucune</option>
                      <option value="Cardiologie">Cardiologie</option>
                      <option value="Neurologie">Neurologie</option>
                      <option value="Pédiatrie">Pédiatrie</option>
                      <option value="Gynécologie-obstétrique">Gynécologie-obstétrique</option>
                      <option value="Traumatologie">Traumatologie</option>
                      <option value="Pneumologie">Pneumologie</option>
                      <option value="Néphrologie">Néphrologie</option>
                      <option value="Gastro-entérologie">Gastro-entérologie</option>
                      <option value="Oncologie">Oncologie</option>
                      <option value="Psychiatrie">Psychiatrie</option>
                      <option value="Radiologie">Radiologie</option>
                      <option value="Anesthésie-réanimation">Anesthésie-réanimation</option>
                    </select>
                  </div>
                  <p>Email: {doctor.email}</p>
                  <p>Téléphone: {doctor.phone}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Aucun médecin trouvé.</p>
        )}
      </div>
    </div>
  );
};

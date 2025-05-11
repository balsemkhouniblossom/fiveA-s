import axios from "axios";
import { useEffect, useState } from "react";
import "./patientfilt.css";

export const Patinetfilter = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/patients");
      setPatients(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des patients:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-title">
        <h2>Liste des Patients</h2>
      </div>

      {loading ? (
        <p className="patient-loading">Chargement...</p>
      ) : (
        <div className="patient-grid">
          {patients && patients.length > 0 ? (
            patients.map((patient, i) => (
              <div key={`${patient.name}-${i}`} className="patient-card">
                <div className="patient-image-wrapper">
                  <img src="/images/patient.png" alt={patient.name} className="patient-image" />
                </div>
                <div className="patient-info">
                  <h4>{patient.name} {patient.lastName}</h4>
                  <p><strong>Email:</strong> {patient.email}</p>
                  <p><strong>Résultats:</strong> {patient.testResults}</p>
                  <p><strong>Historique Médical:</strong> {patient.medicalHistory}</p>
                  <p><strong>Téléphone:</strong> {patient.phone}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="patient-empty">Aucun patient trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

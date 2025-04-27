import { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { FaFilePdf, FaImage, FaClipboardList } from "react-icons/fa"; // Icônes
import "./Patients.css";
import { useNavigate } from "react-router-dom";


const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [patientIds, setPatientIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);  // Affichage du popup
  const [selectedPatient, setSelectedPatient] = useState(null); // Patient sélectionné pour modifier son état
  const [status, setStatus] = useState(""); // État à affecter au patient
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();  // Initialiser navigate avec useNavigate

  // Étape 1 : Récupération des IDs des patients associés
  useEffect(() => {
    const fetchPatientIds = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:3001/appointments/medecin/patients/${userId}`);
        setPatientIds(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des IDs des patients :", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchPatientIds();
    } else {
      console.warn("Aucun utilisateur connecté !");
    }
  }, [userId]);

  // Étape 2 : Récupération des détails patients
  useEffect(() => {
    const fetchPatients = async () => {
      if (patientIds.length > 0) {
        setIsLoading(true);
        try {
          const url = "http://localhost:3001/api/patients/medecin";
          const serializedParams = qs.stringify({ ids: patientIds }, { arrayFormat: "comma" });
          const fullUrl = `${url}?${serializedParams}`;
          setRequestUrl(fullUrl);

          const res = await axios.get(fullUrl);
          setPatients(res.data);
        } catch (err) {
          console.error("Erreur lors du chargement des détails des patients :", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPatients();
  }, [patientIds]);

  // Ouvrir le popup pour mettre à jour l'état
  const openPopup = (patient) => {
    setSelectedPatient(patient);
    setPopupVisible(true);
  };

  // Fermer le popup
  const closePopup = () => {
    setPopupVisible(false);
    setStatus("");
  };
  const goToPatientImages = (patientId) => {
    navigate(`/user/${userId}/images/${patientId._id}`);  
  };
  const goToPatientPdf = (patientId) => {
    navigate(`/user/${userId}/pdf/${patientId._id}`);  
  };
  // Mettre à jour l'état du patient
  const updateStatus = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/patients/${selectedPatient._id}/status`,
        { status }
      );
      console.log("Statut mis à jour", response.data);

      // Mettre à jour l'état local sans recharger la liste des patients
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient._id === selectedPatient._id 
            ? { ...patient, status: response.data.status }  // Mettre à jour uniquement le statut du patient modifié
            : patient
        )
      );

      closePopup();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
    }
  };

  return (
    <div className="patients-container">
      <h2 className="patients-title">Liste des patients du médecin</h2>

      {isLoading ? (
        <p className="loading-message">Chargement...</p>
      ) : (
        <div className="cards-grid">
        {patients.length === 0 ? (
          <p>Aucun patient trouvé.</p>
        ) : (
          patients.map((patient) => {
            // Affichage du status dans la console
            console.log("Statut du patient :", patient.status); // Afficher le statut du patient ici
      
            return (
              <div className="patient-card" key={patient._id}>
                <h3>{patient.name} {patient.lastName}</h3>
                <p><strong>Email :</strong> {patient.email}</p>
                <p><strong>Téléphone :</strong> {patient.phone}</p>
                <p><strong>Status :</strong> {patient.status || 'Pas de statut défini'}</p>
      
                <div className="card-buttons">
                  <button className="pdf-btn" onClick={() => goToPatientPdf(patient)}>
                    <FaFilePdf />
                  </button>
                  <button className="image-btn" onClick={() => goToPatientImages(patient)}>
                    <FaImage />
                  </button>
                  <button className="etat-btn" onClick={() => openPopup(patient)}>
                    <FaClipboardList />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      )}

      {/* Popup pour modifier l'état du patient */}
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Modifier l'état du patient</h3>
            <textarea
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Entrez un nouvel état"
            />
            <button onClick={updateStatus}>Mettre à jour</button>
            <button onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

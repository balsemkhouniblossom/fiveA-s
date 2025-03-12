import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ambulance.css"; // Assurez-vous que ce fichier CSS contient les styles nécessaires

const Ambulance = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/ambulances")
      .then((response) => {
        setAmbulances(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des ambulances :", error);
        setError("Erreur de chargement des ambulances.");
        setLoading(false);
      });
  }, []);
  const handleDeleteAmbulance = async (Id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette ambulance ?")) return;
  
    try {
      const response = await fetch(`http://localhost:3001/ambulances/${Id}`, {
        method: "DELETE",
      });
  
      const result = await response.json(); // 📌 Récupérer la réponse JSON
  
      if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression");
  
      // Remove the deleted ambulance from the state
      setAmbulances((prevAmbulances) => prevAmbulances.filter((ambulance) => ambulance._id !== Id));
  
      alert(result.message); // ✅ Afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert(`Erreur : ${error.message}`);
    }
  };
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/ambulances/${userId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newStatus }),
      }); 

      if (!response.ok) throw new Error("Erreur lors de la mise à jour du rôle");

      setAmbulances((prevAmbulances) =>
      prevAmbulances.map((ambulance) =>
          ambulance._id === userId ? { ...ambulance, status: newStatus } : ambulance
        )
      );
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center">Liste des Ambulances</h2>

      {loading && <p className="text-center">Chargement...</p>}
      {error && <p className="text-center" style={{ color: "red" }}>{error}</p>}

      <div className="row">
        {ambulances.length > 0 ? (
          ambulances.map((ambulance) => (
            <div key={ambulance.id} className="col-md-4">
              <div className="ambulance-card">
                <div className="ambulance-image">
                  <img src="/images/ambulance.png" alt={ambulance.model} />
                </div>
                <div className="ambulance-info">
                  <h3>{ambulance.model}</h3>
                  <p>Numéro de série : {ambulance.serie}</p>
                  <p>Emplacement : {ambulance.location}</p>
                  <p>Contact : {ambulance.contact}</p>
                  <p>status: {ambulance.status}</p>
                  <div className="role-selection">
                <label>Rôle</label>
                <select
                  value={ambulance.status}
                  onChange={(e) => handleStatusChange(ambulance._id, e.target.value)}
                  className="role-select"
                >
                  <option value="BUSY">BUSY</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                </select>
              </div>            
                  </div>
                <div className="ambulance-actions">
                  <button className="delete-button"onClick={() => handleDeleteAmbulance(ambulance._id)}>
                    <span className="material-icons">delete</span> {/* Icone Material */}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center">Aucune ambulance trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default Ambulance;

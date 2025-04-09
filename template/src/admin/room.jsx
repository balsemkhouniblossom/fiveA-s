import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RoomForm = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [availability, setAvailability] = useState(true);
  const [patient, setPatient] = useState("");
  const [patients, setPatients] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Charger la liste des patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users");
        const filtered = response.data.filter((u) => u.role === "PATIENT");
        setPatients(filtered);
      } catch (error) {
        console.error("Erreur lors du chargement des patients :", error);
        setErrorMessage("Erreur lors du chargement des patients.");
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/room", {
        roomNumber,
        availability,
        patient, // null si pas de patient sélectionné
      });
      setSuccessMessage("Salle ajoutée avec succès !");
      setRoomNumber("");
      setAvailability(true);
      setPatient("");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      setErrorMessage("Erreur lors de l'ajout de la salle.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Ajouter une salle</h2>

      {successMessage && (
        <p className="text-green-600 text-center mb-2">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-center mb-2">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Numéro de salle:</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Disponibilité:</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value === "true")}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="true">Disponible</option>
            <option value="false">Occupée</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Patient associé (optionnel):</label>
          <select
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Aucun</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
add Room        </button>
        <button
  type="button"
  onClick={() => navigate("/roomlist")}
  className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mt-2"
>
  Show room list
</button>

      </form>
    </div>
  );
};

export default RoomForm;

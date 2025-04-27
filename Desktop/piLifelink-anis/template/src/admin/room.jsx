import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomUpdate from "./roomUpdate";
import "./roomList.css";

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchNumber, setSearchNumber] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3001/room");
      setRooms(response.data);
    } catch (err) {
      console.error("Erreur :", err);
      setError("Erreur lors du chargement des salles");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette salle ?")) {
      try {
        await axios.delete(`http://localhost:3001/room/${id}`);
        fetchRooms();
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  const handleRoomUpdated = () => {
    setEditingRoom(null);
    fetchRooms();
  };

  const RoomForm = ({ onRoomAdded }) => {
    const [roomNumber, setRoomNumber] = useState("");
    const [availability, setAvailability] = useState(true);
    const [patient, setPatient] = useState("");
    const [patients, setPatients] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      const fetchPatients = async () => {
        try {
          const response = await axios.get("http://localhost:3001/users");
          const filtered = response.data.filter((u) => u.role === "PATIENT");
          setPatients(filtered);
        } catch (error) {
          console.error("Erreur chargement patients :", error);
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
          patient,
        });
        setSuccessMessage("Salle ajoutée avec succès !");
        setRoomNumber("");
        setAvailability(true);
        setPatient("");
        onRoomAdded();
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        setErrorMessage("Erreur lors de l'ajout de la salle.");
      }
    };

    return (
      <div className="max-w-md mx-auto mb-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Room</h2>
        {successMessage && <p className="text-green-600 text-center mb-2">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 text-center mb-2">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Room Number</label>
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
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Ajouter la salle
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-lg">
      <RoomForm onRoomAdded={fetchRooms} />

      <h2 className="text-3xl font-bold mb-8 text-center">Room List</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* --- Barre de recherche --- */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-center">
        <input
          type="text"
          placeholder="Rechercher par numéro..."
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:w-1/3"
        />
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:w-1/3"
        >
          <option value="">Toutes les disponibilités</option>
          <option value="true">Disponible</option>
          <option value="false">Occupée</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms
          .filter((room) => {
            const matchesNumber = room.roomNumber
              .toLowerCase()
              .includes(searchNumber.toLowerCase());
              const matchesAvailability =
              availabilityFilter === ""
                ? true
                : String(room.availability) === availabilityFilter;
            
            return matchesNumber && matchesAvailability;
          })
          .map((room) => (
            <div
              key={room._id}
              className="bg-white border shadow rounded-xl p-5 text-center"
            >
              <p className="text-lg font-semibold mb-2">Room number {room.roomNumber}</p>
              <p className="mb-1">
                <strong>Disponibilité:</strong>{" "}
                {room.availability ? (
                  <span className="text-green-600 font-bold">Disponible</span>
                ) : (
                  <span className="text-red-600 font-bold">Occupée</span>
                )}
              </p>
              <p className="mb-3">
                <strong>Patient:</strong> {room.patient?.name || room.patient || "Aucun"}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-3">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded"
                  onClick={() => setEditingRoom(room)}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  onClick={() => handleDelete(room._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
      </div>

      {editingRoom && (
        <RoomUpdate
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onUpdate={handleRoomUpdated}
        />
      )}
    </div>
  );
};

export default Room;
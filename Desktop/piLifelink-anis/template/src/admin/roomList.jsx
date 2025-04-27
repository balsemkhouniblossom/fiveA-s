import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomUpdate from "./roomUpdate";
import { useNavigate } from "react-router-dom";
import "./roomList.css"; // 👈 Import du fichier CSS

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-lg">
      <h2 className="text-3xl font-bold mb-8 text-center">LISTE DES SALLES</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <div className="flex justify-end mb-6">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/room")}
        >
          + Ajouter une salle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white border shadow rounded-xl p-5 text-center"
          >
            <p className="text-lg font-semibold mb-2">Salle n° {room.roomNumber}</p>
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

      {/* Formulaire de mise à jour */}
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

export default RoomList;
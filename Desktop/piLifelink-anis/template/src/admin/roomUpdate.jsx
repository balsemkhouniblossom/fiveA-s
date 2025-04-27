import React, { useState } from "react";
import axios from "axios";

const RoomUpdate = ({ room, onClose, onUpdate }) => {
  const [updatedRoom, setUpdatedRoom] = useState({
    roomNumber: room.roomNumber,
    availability: room.availability,
    patient: room.patient || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/room/${room._id}`, updatedRoom);
      onUpdate(); // ✅ déclenche le rafraîchissement
    } catch (err) {
      console.error("Erreur update :", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4">Modifier la salle</h3>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Numéro de salle</label>
          <input
            type="text"
            className="w-full border mb-4 p-2 rounded"
            value={updatedRoom.roomNumber}
            onChange={(e) =>
              setUpdatedRoom({ ...updatedRoom, roomNumber: e.target.value })
            }
          />
          <label className="block mb-2">Disponibilité</label>
          <select
            className="w-full border mb-4 p-2 rounded"
            value={updatedRoom.availability}
            onChange={(e) =>
              setUpdatedRoom({
                ...updatedRoom,
                availability: e.target.value === "true",
              })
            }
          >
            <option value="true">Disponible</option>
            <option value="false">Occupée</option>
          </select>
          <label className="block mb-2">Patient</label>
          <input
            type="text"
            className="w-full border mb-4 p-2 rounded"
            value={updatedRoom.patient}
            onChange={(e) =>
              setUpdatedRoom({ ...updatedRoom, patient: e.target.value })
            }
          />
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomUpdate;
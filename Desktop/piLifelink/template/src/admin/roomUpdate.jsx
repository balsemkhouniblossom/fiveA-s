import React, { useState } from "react";
import axios from "axios";
import "./RoomUpdate.css"; // <-- important : importer le css

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
      onUpdate(); // ✅ déclenche le rafraîchissement après update
    } catch (err) {
      console.error("Erreur update :", err);
    }
  };

  return (
    <div className="room-update-overlay">
      <div className="room-update-container">
        <h3 className="room-update-title">Modifier la salle</h3>
        <form onSubmit={handleSubmit} className="room-update-form">
          <label>Numéro de salle</label>
          <input
            type="text"
            value={updatedRoom.roomNumber}
            onChange={(e) =>
              setUpdatedRoom({ ...updatedRoom, roomNumber: e.target.value })
            }
          />
          <label>Disponibilité</label>
          <select
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
          <div className="room-update-buttons">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomUpdate;

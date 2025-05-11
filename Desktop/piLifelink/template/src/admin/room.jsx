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
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post("http://localhost:3001/room", {
          roomNumber,
          availability,
        });
        setSuccessMessage("Salle ajoutée avec succès !");
        setRoomNumber("");
        setAvailability(true);
        onRoomAdded();
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        setErrorMessage("Erreur lors de l'ajout de la salle.");
      }
    };

    return (
      <div className="form-container">
        <h2 className="title-section">Add Room</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>Room Number</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />

          <label>Disponibilité:</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value === "true")}
          >
            <option value="true">Disponible</option>
            <option value="false">Occupée</option>
          </select>

          <button type="submit" className="btn-primary">
            + Add room
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Formulaire d'ajout */}
      <RoomForm onRoomAdded={fetchRooms} />

      {/* Titre */}
      <h2 className="title-main">Room List</h2>

      {/* Message d'erreur */}
      {error && <p className="error-message">{error}</p>}

      {/* --- Barre de recherche et filtre --- */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Rechercher par numéro..."
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          className="search-input"
        />
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="search-select"
        >
          <option value="">Toutes les disponibilités</option>
          <option value="true">Disponible</option>
        </select>
      </div>

      {/* Liste des salles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms
          .filter((room) => {
            const matchesNumber = String(room.roomNumber)
              .toLowerCase()
              .includes(searchNumber.toLowerCase());

            let matchesAvailability = true;
            if (availabilityFilter === "true") {
              matchesAvailability = room.availability === true;
            } else if (availabilityFilter === "false") {
              matchesAvailability = room.availability === false;
            }

            return matchesNumber && matchesAvailability;
          })
          .map((room) => (
            <div key={room._id} className="room-card">
              <p className="text-lg font-semibold mb-2">
                Room number {room.roomNumber}
              </p>
              <p>
                <strong>Disponibilité:</strong>{" "}
                <span
                  className={
                    room.availability
                      ? "status-available"
                      : "status-occupied"
                  }
                >
                  {room.availability ? "Disponible" : "Occupée"}
                </span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-3">
                <button
                  className="btn-secondary"
                  onClick={() => setEditingRoom(room)}
                >
                  {/* Icon Edit */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  </svg>
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(room._id)}
                >
                  {/* Icon Delete */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
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

export default Room;

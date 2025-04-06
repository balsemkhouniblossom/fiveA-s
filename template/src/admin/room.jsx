import React, { useState } from 'react';
import axios from 'axios';

function AddRoom() {
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRoom = { roomNumber, description };

    try {
      const response = await axios.post('http://localhost:3001/addroom', newRoom);
      setMessage(response.data.message);  
      setRoomNumber('');
      setDescription('');
    } catch (error) {
      console.error(error);
      setMessage('Erreur lors de l\'ajout de la salle');
    }
  };

  return (
    <div>
      <h2>Ajouter une salle</h2>
      {message && <p>{message}</p>}  
      <form onSubmit={handleSubmit}>
        <div>
          <label>Numéro de la salle</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter la salle</button>
      </form>
    </div>
  );
}

export default AddRoom;

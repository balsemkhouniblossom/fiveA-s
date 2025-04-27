import React from 'react';

const Popping = ({ open, handleClose, event }) => {
  if (!event) return null; 

  return (
    open && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{event.title}</h2>
          <p><strong>Start:</strong> {new Date(event.start).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(event.end).toLocaleString()}</p>
          <p><strong>Description:</strong> {event.description}</p>

          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default Popping;

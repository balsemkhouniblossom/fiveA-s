import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import './popping.css';
import './DoctorCalendar.css'; // On utilise le même fichier CSS

import Popping from './popping'; 

const localizer = momentLocalizer(moment);

const OperationCalendarMedecin = ({doctorId}) => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/doctor/${doctorId}`)
      .then((res) => {
        console.log(res.data);

        const formattedEvents = res.data.map((op) => ({
          id: op.id, // Ensure each event has a unique id
          title: `Opération : ${op.description}`,
          start: new Date(op.startTime),
          end: new Date(op.endTime),
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des opérations :', err);
      });
  }, [doctorId]);

  const openEventClick = (event) => {
    setCurrentEvent(event); 
    setOpen(true); 
  };

  const closeEventClick = () => {
    setOpen(false); // Close the modal
  };

  return (
    <div>
      {/* Popping is your modal component */}
      <Popping
        open={open}
        handleClose={closeEventClick}
        event={currentEvent} // Pass the current event details to the modal
      />

      <div className="doctor-calendar-container">
      <h2 className="calendar-title">📅 Planning des Opérations du Médecin</h2>
        <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: 450 }}
          onSelectEvent={openEventClick} 
        />
        </div>
      </div>
    </div>
  );
};

export default OperationCalendarMedecin;

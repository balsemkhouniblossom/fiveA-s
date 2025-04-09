import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

import Popping from './popping'; 

const localizer = momentLocalizer(moment);

const OperationCalendarPatient = () => {
  const { patientId } = useParams();
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/patient/${patientId}`)
      .then((res) => {
        console.log(res.data);

        const formattedEvents = res.data.map((op) => ({
          id: op.id, 
          title: `Opération : ${op.description}`,
          start: new Date(op.startTime),
          end: new Date(op.endTime),
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des opérations :', err);
      });
  }, [patientId]);

  const openEventClick = (event) => {
    setCurrentEvent(event); 
    setOpen(true); 
  };

  const closeEventClick = () => {
    setOpen(false); 
  };

  return (
    <div>
      <Popping
        open={open}
        handleClose={closeEventClick}
        event={currentEvent} 
      />

      <div className="calendar-container" style={{ height: 700, margin: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Planning des Opérations du Médecin</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={openEventClick} 
        />
      </div>
    </div>
  );
};

export default OperationCalendarPatient;

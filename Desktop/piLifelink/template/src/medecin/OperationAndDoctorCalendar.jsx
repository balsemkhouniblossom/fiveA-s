import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Popping from './popping';
import './DoctorCalendar.css';

const localizer = momentLocalizer(moment);

const OperationAndDoctorCalendar = ({ doctorId }) => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const opRes = await axios.get(`http://localhost:3001/doctor/${doctorId}`);
        const operationEvents = opRes.data.map(op => ({
          id: op.id,
          title: `🛠 Opération : ${op.description}`,
          start: new Date(op.startTime),
          end: new Date(op.endTime),
          type: 'operation',
        }));

        const apptRes = await axios.get(`http://localhost:3001/appointments/doctor/${doctorId}`);
        const appointmentEvents = apptRes.data.map(appt => {
          const hasPatient = appt.patient && appt.patient.name && appt.patient.lastName;
          return {
            title: hasPatient ? `👤 ${appt.patient.name} ${appt.patient.lastName}` : '👤 Rendez-vous (inconnu)',
            start: new Date(appt.startTime),
            end: new Date(appt.endTime),
            type: 'appointment',
          };
        });

        setEvents([...operationEvents, ...appointmentEvents]);
      } catch (error) {
        console.error("Erreur de chargement des données :", error);
      }
    };

    loadEvents();
  }, [doctorId]);

  const openEventClick = (event) => {
    setCurrentEvent(event);
    setOpen(true);
  };

  const closeEventClick = () => {
    setOpen(false);
  };

  // Style des événements selon le type
  const eventStyleGetter = (event) => {
    let backgroundColor = '#95a5a6'; // Gris par défaut
    if (event.type === 'operation') backgroundColor = '#e74c3c';     // Rouge
    if (event.type === 'appointment') backgroundColor = '#3498db';   // Bleu

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '6px',
        padding: '2px 5px',
        border: 'none',
        fontWeight: '600',
        fontSize: '0.9rem',
      },
    };
  };

  return (
    <div className="doctor-calendar-container">
      <br />
      <br />
      <h2 className="calendar-title">📅 Planning du Médecin : Opérations & Rendez-vous</h2>

      <Popping open={open} handleClose={closeEventClick} event={currentEvent} />

      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={openEventClick}
          eventPropGetter={eventStyleGetter}
          style={{ height: '100%', minHeight: 450 }}
        />
      </div>
    </div>
  );
};

export default OperationAndDoctorCalendar;

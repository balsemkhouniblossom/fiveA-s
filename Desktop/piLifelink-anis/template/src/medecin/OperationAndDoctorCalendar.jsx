import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Popping from './popping';

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
          title: `Opération : ${op.description}`,
          start: new Date(op.startTime),
          end: new Date(op.endTime),
          type: 'operation',
          color: '#ff6347',
        }));

        const apptRes = await axios.get(`http://localhost:3001/appointments/doctor/${doctorId}`);
        const appointmentEvents = apptRes.data.map(appt => {
          const hasPatient = appt.patient && appt.patient.name && appt.patient.lastName;
          return {
            title: hasPatient ? `${appt.patient.name} ${appt.patient.lastName}` : 'Rendez-vous (patient inconnu)',
            start: new Date(appt.startTime),
            end: new Date(appt.endTime),
            type: 'appointment',
            color: '#1e90ff',
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

  return (
    <div>
      <Popping
        open={open}
        handleClose={closeEventClick}
        event={currentEvent}
      />

      <div className="calendar-container" style={{ height: 700, margin: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Planning des Opérations et Rendez-vous du Médecin</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={openEventClick}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
            },
          })}
        />
      </div>
    </div>
  );
};

export default OperationAndDoctorCalendar;

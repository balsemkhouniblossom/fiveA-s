import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import './DoctorCalendar.css'; // 🔗 le fichier CSS stylé

const localizer = momentLocalizer(moment);

const DoctorCalendar = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/appointments/doctor/${doctorId}`)
      .then(res => {
        const formattedAppointments = res.data.map(appt => {
          const hasPatient = appt.patient && appt.patient.name && appt.patient.lastName;
          return {
            title: hasPatient
              ? `${appt.patient.name} ${appt.patient.lastName}`
              : 'Rendez-vous (inconnu)',
            start: new Date(appt.startTime),
            end: new Date(appt.endTime),
          };
        });
        setAppointments(formattedAppointments);
      })
      .catch(error => console.error("Erreur de chargement des rendez-vous", error));
  }, [doctorId]);

  return (
    <div className="doctor-calendar-container">
      <h2 className="calendar-title">📅 Planning du Docteur</h2>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: 450 }}
        />
      </div>
    </div>
  );
};

export default DoctorCalendar;

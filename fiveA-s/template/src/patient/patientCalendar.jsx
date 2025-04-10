import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const PatientCalendar = () => {
  const { patientId } = useParams();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/appointments/patient/${patientId}`)
      .then(res => {
        const formattedAppointments = res.data.map(appt => ({
          title: `${appt.doctor.name} ${appt.doctor.lastName}`,
          start: new Date(appt.startTime),
          end: new Date(appt.endTime),
        }));
        setAppointments(formattedAppointments);
      })
      .catch(error => console.error("Erreur de chargement des rendez-vous", error));
  }, [patientId]);

  return (
    <div className="calendar-container" style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default PatientCalendar;

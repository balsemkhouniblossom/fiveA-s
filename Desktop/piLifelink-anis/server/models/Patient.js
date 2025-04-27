import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import './rdv.css';

const localizer = momentLocalizer(moment);

const Rdv = () => {
  const { idMedecin } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/appointments/medecin/${idMedecin}`);

        // Vérifiez que response.data.startTimes est un tableau
        if (Array.isArray(response.data.startTimes)) {
          const formattedAppointments = response.data.startTimes.map(startTime => ({
            title: 'Rendez-vous', // Vous pouvez personnaliser le titre si nécessaire
            start: new Date(startTime),
            end: new Date(new Date(startTime).getTime() + 60 * 60 * 1000), // Ajoutez une heure pour l'heure de fin
          }));
          setAppointments(formattedAppointments);
        } else {
          console.error('Les données renvoyées par l\'API ne contiennent pas de tableau startTimes:', response.data);
        }
      } catch (error) {
        console.error('Erreur de récupération des rendez-vous:', error);
      }
    };

    fetchAppointments();
  }, [idMedecin]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const handleRequestAppointment = async () => {
    if (!selectedDate) {
      setRequestMessage('Veuillez sélectionner une date.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3001/appointments/request`, {
        doctorId: idMedecin,
        requestedDate: selectedDate,
      });

      setRequestMessage('Demande de rendez-vous envoyée avec succès.');
    } catch (error) {
      setRequestMessage('Erreur lors de l\'envoi de la demande de rendez-vous.');
      console.error('Erreur lors de l\'envoi de la demande de rendez-vous:', error);
    }
  };

  return (
    <div className="container">
      <h2>Prendre rendez-vous avec un médecin</h2>
      <div className="calendar-container">
        <h3>Planning du médecin</h3>
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
        />
        {selectedDate && (
          <div>
            <p>Date sélectionnée : {selectedDate.toDateString()}</p>
            <button onClick={handleRequestAppointment}>Demander un rendez-vous</button>
          </div>
        )}
        {requestMessage && <p>{requestMessage}</p>}
      </div>
    </div>
  );
};

export default Rdv;

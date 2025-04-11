import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './rdv.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Rdv = () => {
  const [date, setDate] = useState(new Date());
  const [reservedDates, setReservedDates] = useState([]);
  const { idMedecin } = useParams();

  // Récupérer les dates réservées pour le médecin
  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/appointments/medecin/${idMedecin}`);
        
        const startTimes = response.data.startTimes || [];

        const formattedDates = startTimes.map(dateStr => new Date(dateStr));

        setReservedDates(formattedDates);
      } catch (error) {
        console.error('Erreur de récupération des rendez-vous:', error);
      }
    };

    fetchReservedDates();
  }, [idMedecin]);

  // Gérer le changement de date sélectionnée
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Appliquer un style spécial aux dates réservées
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      return reservedDates.some(
        (reserved) => reserved.toDateString() === date.toDateString()
      ) ? 'reserved-date' : null;
    }
  };

  return (
    <div className="container">
      <h2>Prendre rendez-vous avec un médecin</h2>

      <div className="calendar-container">
        <h3>Choisissez une date</h3>

        <Calendar
          onChange={handleDateChange}
          value={date}
          minDate={new Date()}
          tileClassName={tileClassName}
        />

        <p>Date sélectionnée : {date.toDateString()}</p>


       
      </div>
    </div>
  );
};

export default Rdv;

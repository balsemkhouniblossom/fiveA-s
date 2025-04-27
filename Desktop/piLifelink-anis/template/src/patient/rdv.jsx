import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import './rdv.css';

const localizer = momentLocalizer(moment);

const Rdv = () => {
  const { idMedecin } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const userId = localStorage.getItem("userId"); // ID du médecin connecté

  const fetchData = async () => {
    try {
      const appointmentsResponse = await axios.get(`http://localhost:3001/appointments/medecin/${idMedecin}`);

      // Vérifie que c'est un tableau
      const appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];

      const formattedAppointments = appointments.map(appt => ({
        title: appt.patient?.name
          ? `Rendez-vous avec ${appt.patient.name} ${appt.patient.lastName}`
          : 'Rendez-vous',
        start: new Date(appt.startTime),
        end: new Date(appt.endTime),
      }));

      const operationsResponse = await axios.get(`http://localhost:3001/doctor/${idMedecin}`);
      const operations = Array.isArray(operationsResponse.data) ? operationsResponse.data : [];

      const formattedOperations = operations.map(op => ({
        title: `Opération : ${op.description}`,
        start: new Date(op.startTime),
        end: new Date(op.endTime),
      }));

      setEvents([...formattedAppointments, ...formattedOperations]);
    } catch (error) {
      console.error('Erreur de récupération des données:', error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idMedecin]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedTime(slotInfo.start);
    setRequestMessage('');
  };

  const isSlotAvailable = (start, end) => {
    return !events.some(event => {
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      return (
        (start >= eventStart && start < eventEnd) ||
        (end > eventStart && end <= eventEnd) ||
        (start <= eventStart && end >= eventEnd)
      );
    });
  };

  const handleRequestAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setRequestMessage('Veuillez sélectionner une date et une heure.');
      return;
    }

    const startTime = selectedTime;
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    if (startTime < new Date()) {
      setRequestMessage("Impossible de prendre un rendez-vous dans le passé.");
      return;
    }

    if (!isSlotAvailable(startTime.getTime(), endTime.getTime())) {
      setRequestMessage("Ce créneau est déjà occupé. Veuillez en choisir un autre.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3001/appointments`, {
        startTime,
        endTime,
        status: 'pending',
        patient: userId, // 🔁 À remplacer dynamiquement avec l'utilisateur connecté
        doctor: idMedecin,
      });

      setRequestMessage('Rendez-vous ajouté avec succès.');
      fetchData();
    } catch (error) {
      setRequestMessage("Erreur lors de l'ajout du rendez-vous.");
      console.error("Erreur lors de l'ajout du rendez-vous:", error.response?.data || error);
    }
  };

  return (
    <div className="container">
      <h2>Prendre rendez-vous avec un médecin</h2>
      <div className="calendar-container">
        <h3>Planning du médecin</h3>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
        />

        {selectedDate && selectedTime && (
          <div>
            <p>Date sélectionnée : {selectedDate.toDateString()}</p>
            <DateTimePicker
              onChange={setSelectedTime}
              value={selectedTime}
              format="y-MM-dd HH:mm:ss"
              minDate={new Date()}
            />
            <button onClick={handleRequestAppointment}>Confirmer le rendez-vous</button>
          </div>
        )}

        {requestMessage && <p>{requestMessage}</p>}
      </div>
    </div>
  );
};

export default Rdv;

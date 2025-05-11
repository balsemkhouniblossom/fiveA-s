import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const hospitalIcon = new L.Icon({
  iconUrl: '/hospital.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const otherIcon = new L.Icon({
  iconUrl: '/emrgency.png',
  iconSize: [40, 40],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const ambulanceIcon = new L.Icon({
  iconUrl: '/ambulance.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const hospitalPosition = [36.8020620949773, 10.105520217886193];
const API_KEY = '5b3ce3597851110001cf6248bc923b0333dd4573b90d846c4a819a03';

const Map = () => {
  const [confirmedLocations, setConfirmedLocations] = useState([]);
  const [pendingLocations, setPendingLocations] = useState([]);
  const [routes, setRoutes] = useState({});
  const [ambulances, setAmbulances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [ambulanceRoute, setAmbulanceRoute] = useState([]);
  const [ambulancePosition, setAmbulancePosition] = useState(hospitalPosition);
  const [isAmbulanceMoving, setIsAmbulanceMoving] = useState(false);
  const [ambulanceStartTime, setAmbulanceStartTime] = useState(null);

  // Récupérer la liste des ambulances
  const loadAmbulances = async () => {
    try {
      const response = await axios.get('http://localhost:3001/ambulances');
      setAmbulances(response.data);
    } catch (err) {
      console.error('Erreur récupération ambulances:', err.message);
    }
  };

  const fetchRoute = async (start, end) => {
    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
      const res = await axios.get(url);
      const coords = res.data.features?.[0]?.geometry?.coordinates;
      return coords ? coords.map(c => [c[1], c[0]]) : [];
    } catch (error) {
      console.error('Erreur route:', error.message);
      return [];
    }
  };

  const loadLocations = useCallback(async () => {
    try {
      const [resConfirmed, resPending] = await Promise.all([
        axios.get('http://localhost:3001/locations'),
        axios.get('http://localhost:3001/locations/pending')
      ]);

      const confirmed = resConfirmed.data.filter(loc => loc.lat && loc.lng);
      setConfirmedLocations(confirmed);
      setPendingLocations(resPending.data);

      const routeMap = {};
      for (const loc of confirmed) {
        const route = await fetchRoute(hospitalPosition, [loc.lat, loc.lng]);
        if (route.length > 0) {
          routeMap[loc._id] = route;
        }
      }
      setRoutes(routeMap);
    } catch (err) {
      console.error('Erreur chargement données:', err.message);
    }
  }, []);

  useEffect(() => {
    loadLocations();
    loadAmbulances();
  }, [loadLocations]);

  const confirmLocation = async (id) => {
    try {
      await axios.put(`http://localhost:3001/locations/${id}/confirm`);
      loadLocations();
    } catch (err) {
      console.error('Erreur confirmation:', err.message);
    }
  };

  const assignAmbulanceToLocation = async () => {
    if (!selectedLocation || !selectedAmbulance) return;
    try {
      await axios.post('http://localhost:3001/api/affecterambulace', {
        locationId: selectedLocation._id,
        ambulanceId: selectedAmbulance._id
      });

      // Success Alert
      alert('Ambulance affectée avec succès à la localisation!');

      // Fetch ambulance route to the location
      const route = await fetchRoute(hospitalPosition, [selectedLocation.lat, selectedLocation.lng]);
      setAmbulanceRoute(route);

      // Start ambulance movement
      setAmbulanceStartTime(Date.now());
      setIsAmbulanceMoving(true);

      setShowModal(false);
      loadLocations();
    } catch (err) {
      console.error('Erreur affectation ambulance:', err.message);
    }
  };

  const moveAmbulance = useCallback(() => {
    if (isAmbulanceMoving && ambulanceRoute.length > 0) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - ambulanceStartTime; // Time elapsed since the ambulance started moving
      const totalDuration = 120000; // 2 minutes in milliseconds
      const progress = Math.min(elapsedTime / totalDuration, 1); // Normalize progress (0 to 1)
  
      // Calculate position based on progress
      const index = Math.floor(progress * (ambulanceRoute.length - 1));
      setAmbulancePosition(ambulanceRoute[index]);
  
      if (progress === 1) {
        setIsAmbulanceMoving(false); // Stop moving when the ambulance reaches the destination
        alert('L\'ambulance a atteint la destination!'); // Alerte quand l\'ambulance arrive à la destination
      }
    }
  }, [isAmbulanceMoving, ambulanceRoute, ambulanceStartTime]);
  
  const deleteLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/locations/${id}`);
      loadLocations();
    } catch (err) {
      console.error('Erreur suppression:', err.message);
    }
  };
  

  useEffect(() => {
    if (isAmbulanceMoving) {
      const interval = setInterval(moveAmbulance, 100); // Update position every 100ms
      return () => clearInterval(interval);
    }
  }, [isAmbulanceMoving, moveAmbulance]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Boîte des localisations en attente */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        background: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        maxHeight: '80vh',
        width: '300px',
        overflowY: 'auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#333', textAlign: 'center' }}>🕒 À valider</h3>

        {pendingLocations.length === 0 ? (
          <p style={{ color: '#777', textAlign: 'center' }}>Aucune localisation à valider.</p>
        ) : (
          pendingLocations.map(loc => (
            <div
              key={loc._id}
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #28a745'
              }}
            >
              <p style={{ margin: '4px 0' }}><strong>Latitude:</strong> {loc.lat}</p>
              <p style={{ margin: '4px 0' }}><strong>Longitude:</strong> {loc.lng}</p>
              <button
                onClick={() => confirmLocation(loc._id)}
                style={{
                  marginTop: '8px',
                  marginRight: '6px',
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✅ Confirmer
              </button>

              <button
                onClick={() => deleteLocation(loc._id)}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Supprimer
              </button>
            </div>
          ))
        )}
      </div>

      {/* Carte */}
      <MapContainer
        center={[35.5, 9.5]}
        zoom={7}
        style={{ height: '100vh', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={hospitalPosition} icon={hospitalIcon}>
          <Popup>Centre Hospitalier Principal</Popup>
        </Marker>

        {confirmedLocations.map(loc => (
          <React.Fragment key={loc._id}>
            <Marker
              position={[loc.lat, loc.lng]}
              icon={otherIcon}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc);
                  setShowModal(true);
                }
              }}
            >
              <Popup>
                <strong>Urgence</strong><br />
                Latitude: {loc.lat}<br />
                Longitude: {loc.lng}
              </Popup>
            </Marker>
            {routes[loc._id] && (
              <Polyline positions={routes[loc._id]} pathOptions={{ color: 'blue', weight: 4 }} />
            )}
          </React.Fragment>
        ))}

        {/* Display ambulance's route and marker */}
        {ambulanceRoute.length > 0 && (
          <>
            <Polyline positions={ambulanceRoute} pathOptions={{ color: 'red', weight: 4 }} />
            <Marker position={ambulancePosition} icon={ambulanceIcon}>
              <Popup>Ambulance en route</Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* Modal pour affecter une ambulance */}
      {showModal && selectedLocation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1001,
          width: '400px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h3 style={{ textAlign: 'center' }}>Affecter une ambulance</h3>
          <p style={{ textAlign: 'center' }}>
            Lat: {selectedLocation.lat}
          </p>
          <p style={{ textAlign: 'center' }}>
            Lng:  {selectedLocation.lng}
          </p>
        

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Sélectionner Ambulance</label>
            <select
              onChange={e => setSelectedAmbulance(ambulances.find(a => a._id === e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="">Choisissez une ambulance</option>
              {ambulances.map(ambulance => (
                <option key={ambulance._id} value={ambulance._id}>
                  {ambulance.model}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={assignAmbulanceToLocation}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Affecter
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

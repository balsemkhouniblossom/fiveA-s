import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import "leaflet/dist/leaflet.css";

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

const hospitalPosition = [36.89860883445896, 10.188693963915098];
const API_KEY = '5b3ce3597851110001cf6248bc923b0333dd4573b90d846c4a819a03';

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    const fetchLocationsAndRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/locations');
        const locs = response.data;
        setLocations(locs);

        const allRoutes = {};

        for (const loc of locs) {
          const start = hospitalPosition;
          const end = [loc.lat, loc.lng];
          let routeCoords = await fetchRoute(start, end);

          if (routeCoords.length === 0) {
            console.warn("⚠️ Pas de route trouvée, on trace direct:", start, end);
            routeCoords = [start, end];
          }

          allRoutes[loc._id] = routeCoords;
        }

        console.log("ROUTES CHARGÉES:", allRoutes);
        setRoutes(allRoutes);

      } catch (error) {
        console.error("Erreur chargement des locations:", error);
      }
    };

    fetchLocationsAndRoutes();
  }, []);

  const fetchRoute = async (start, end) => {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

    try {
      const response = await axios.get(url);
      const coords = response.data.features[0]?.geometry?.coordinates;

      if (!coords) return [];

      return coords.map(c => [c[1], c[0]]);

    } catch (error) {
      console.error("Erreur route OpenRouteService:", error);
      return [];
    }
  };

  return (
    <MapContainer
      center={[34.0, 9.0]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={hospitalPosition}
        icon={hospitalIcon}
      >
        <Popup>Centre Principal - Hôpital</Popup>
      </Marker>

      {locations.map((location) => (
        <React.Fragment key={location._id}>
          <Marker
            position={[location.lat, location.lng]}
            icon={otherIcon}
          >
            <Popup>
              Latitude: {location.lat} <br />
              Longitude: {location.lng}
            </Popup>
          </Marker>

          {routes[location._id] && (
            <Polyline
              positions={routes[location._id]}
              pathOptions={{ color: 'blue', weight: 4 ,dashArray: '10, 10' }}
            />
          )}
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default Map;

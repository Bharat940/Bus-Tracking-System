import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css"; // styling ke liye

// 🚌 Custom Bus Icon
const busIcon = new L.Icon({
  iconUrl: "bus.png", // public folder me bus.png rakho
  iconSize: [40, 40],
});

// 🚏 Custom Stop Icon
const stopIcon = new L.Icon({
  iconUrl: "stop.png", // public folder me stop.png rakho
  iconSize: [30, 30],
});

// 📍 Current Location Marker Component
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function App() {
  // 🚏 Stops data
  const stops = [
    [23.2599, 77.4126], // Bhopal Center
    [23.2450, 77.4380],
    [23.2300, 77.4600],
    [23.2100, 77.4900],
  ];

  // 🚌 Bus ka position (move hota rahega)
  const [busIndex, setBusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusIndex((prev) => (prev + 1) % stops.length);
    }, 2000); // har 2 sec me move karega
    return () => clearInterval(interval);
  }, [stops.length]);

  return (
    <div className="app">
      {/* 🔍 Top Search Bar */}
      <div className="top-bar">
        <input type="text" placeholder="Enter Pickup" />
        <input type="text" placeholder="Enter Destination" />
      </div>

      {/* 🗺 Map */}
      <MapContainer center={[23.2599, 77.4126]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {/* Polyline Route */}
        <Polyline positions={stops} color="blue" weight={4} opacity={0.7} />

        {/* Stops */}
        {stops.map((stop, i) => (
          <Marker key={i} position={stop} icon={stopIcon}>
            <Popup>Stop {i + 1}</Popup>
          </Marker>
        ))}

        {/* Bus Moving */}
        <Marker position={stops[busIndex]} icon={busIcon}>
          <Popup>Bus is here</Popup>
        </Marker>

        {/* Current Location */}
        <LocationMarker />
      </MapContainer>

      {/* 📱 Bottom Sheet */}
      <div className="bottom-sheet">
        <h3>Ride Details</h3>
        <p>Pickup: AIIMS Bhopal</p>
        <p>Drop: Habibganj</p>
        <button className="book-btn">Book Ride</button>
      </div>
    </div>
  );
}

export default App;
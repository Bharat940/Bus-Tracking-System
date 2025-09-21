import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { createRoute } from "../services/tracking.service";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getRoutePolyline } from "../services/routing.service";

const stopIcon = new L.Icon({
  iconUrl: "/stop.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Map click handler to add stops
function MapClicker({ stops, setStops }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const name = prompt("Enter stop name:");
      if (!name) return;
      setStops([...stops, { lat, lng, name }]);
    },
  });
  return null;
}

// Auto-fit map to stops
function FitBounds({ stops }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stops]);
  return null;
}

export default function CreateRoute() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [stops, setStops] = useState([]);
  const [polyline, setPolyline] = useState([]);
  const navigate = useNavigate();

  const createStops = async (stops) => {
    const createdStopIds = [];
    const token = localStorage.getItem("token");

    for (let stop of stops) {
      const res = await axios.post(
        "http://localhost:5000/api/stops",
        {
          name: stop.name,
          location: { type: "Point", coordinates: [stop.lng, stop.lat] },
          city,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      createdStopIds.push(res.data.data._id);
    }

    return createdStopIds;
  };

  const calculateDistance = (coords) => {
    if (!coords || coords.length < 2) return 0;
    const R = 6371;
    let distance = 0;
    for (let i = 1; i < coords.length; i++) {
      const [lat1, lng1] = coords[i - 1];
      const [lat2, lng2] = coords[i];
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance += R * c;
    }
    return distance.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || stops.length === 0)
      return alert("Route name and at least one stop required");

    try {
      const stopIds = await createStops(stops);
      const polylineCoords = await getRoutePolyline(stops);
      setPolyline(polylineCoords);

      const routeData = {
        name,
        city,
        stops: stopIds,
        polyline: {
          type: "LineString",
          coordinates: polylineCoords.map(([lat, lng]) => [lng, lat]),
        },
        distanceKm: calculateDistance(polylineCoords),
        schedule: [],
        active: true,
        owner: localStorage.getItem("userId"),
      };

      await createRoute(routeData);
      alert("Route created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create route");
    }
  };

  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Create Route</h2>

      <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-lg space-y-5">
        {/* Route Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Route Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
          />
        </div>

        {/* Map */}
        <div className="relative h-96 rounded-lg overflow-hidden shadow-md">
          <MapContainer
            center={[23.2599, 77.4126]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            <MapClicker stops={stops} setStops={setStops} />
            <FitBounds stops={stops} />

            {stops.map((stop, idx) => (
              <Marker key={idx} position={[stop.lat, stop.lng]} icon={stopIcon}>
                <Popup>
                  <div>
                    <strong>{stop.name}</strong>
                    <br />
                    <button
                      className="text-red-600 mt-1 underline"
                      onClick={() => removeStop(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {polyline.coordinates?.length > 1 && (
              <Polyline
                positions={polyline.coordinates.map(([lng, lat]) => [lat, lng])}
                color="#4F46E5"
                weight={4}
              />
            )}
          </MapContainer>
        </div>

        {/* Distance Info */}
        {polyline.coordinates?.length > 1 && (
          <div className="text-right text-gray-700 font-medium">
            Distance:{" "}
            {calculateDistance(
              polyline.coordinates.map(([lng, lat]) => [lat, lng])
            )}{" "}
            km
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
        >
          Create Route
        </button>
      </div>
    </div>
  );
}

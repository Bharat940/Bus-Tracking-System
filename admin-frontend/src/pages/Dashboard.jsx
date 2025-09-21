import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import { getRoutes } from "../services/tracking.service.js";
import { getBuses } from "../services/bus.service.js";
import axios from "axios";

const busIcon = new L.Icon({
  iconUrl: "/bus.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

const stopIcon = new L.Icon({
  iconUrl: "/stop.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function FitBounds({ stops }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [80, 80] });
    }
  }, [stops]);
  return null;
}

export default function AdminDashboard() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [buses, setBuses] = useState([]);
  const [busLocations, setBusLocations] = useState({});
  const [busETAs, setBusETAs] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("bus:location", ({ busId, coords }) => {
      setBusLocations((prev) => ({ ...prev, [busId]: coords }));
      updateBusETA(busId, coords);
    });

    fetchRoutes();
    fetchBuses();

    return () => newSocket.disconnect();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await getRoutes();
      setRoutes(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBuses = async () => {
    try {
      const data = await getBuses();
      setBuses(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    if (!socket) return;
    buses
      .filter((b) => b.route === route._id)
      .forEach((bus) => socket.emit("subscribe:bus", bus._id));
  };

  const updateBusETA = async (busId, coords) => {
    if (!selectedRoute) return;
    const nextStop = selectedRoute.stops.find((s) => !s.reached);
    if (!nextStop) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/tracking/eta/${busId}/${nextStop._id}`
      );
      if (res.data.success) {
        setBusETAs((prev) => ({ ...prev, [busId]: res.data.data.eta }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Routes</h2>
        {routes.length === 0 && (
          <p className="text-gray-500">No routes created yet</p>
        )}
        {routes.map((route) => (
          <div
            key={route._id}
            className={`p-3 rounded-lg mb-3 cursor-pointer border ${
              selectedRoute?._id === route._id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:bg-gray-100"
            } transition`}
            onClick={() => handleRouteSelect(route)}
          >
            <h3 className="font-semibold">{route.name}</h3>
            <p className="text-sm text-gray-600">{route.stops.length} stops</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[23.2599, 77.4126]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          {selectedRoute && (
            <FitBounds
              stops={selectedRoute.stops.map((s) => ({
                lat: s.location.coordinates[1],
                lng: s.location.coordinates[0],
              }))}
            />
          )}

          {selectedRoute?.stops.map((stop) => (
            <Marker
              key={stop._id}
              position={[
                stop.location.coordinates[1],
                stop.location.coordinates[0],
              ]}
              icon={stopIcon}
            >
              <Popup className="text-sm">{stop.name || "Stop"}</Popup>
            </Marker>
          ))}

          {selectedRoute?.polyline?.coordinates?.length > 1 && (
            <Polyline
              positions={selectedRoute.polyline.coordinates.map(
                ([lng, lat]) => [lat, lng]
              )}
              color="#4F46E5"
              weight={5}
            />
          )}

          {buses
            .filter((b) => b.route === selectedRoute?._id)
            .map((bus) => {
              const coords =
                busLocations[bus._id] || bus.currentLocation?.coordinates;
              if (!coords) return null;
              return (
                <Marker
                  key={bus._id}
                  position={[coords[1], coords[0]]}
                  icon={busIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{bus.name}</strong>
                      <br />
                      ETA to next stop: {busETAs[bus._id] || "Calculating..."}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}

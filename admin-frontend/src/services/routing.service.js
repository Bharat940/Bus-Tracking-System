import axios from "axios";

export const getRoutePolyline = async (stops) => {
  if (stops.length < 2) return [];

  const coordinates = stops.map((s) => [s.lng, s.lat]);
  const apiKey =  import.meta.env.VITE_ORS_API_KEY;

  try {
    const res = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      { coordinates },
      { headers: { Authorization: apiKey } }
    );
    return res.data.features[0].geometry.coordinates.map(([lng, lat]) => [
      lat,
      lng,
    ]);
  } catch (err) {
    console.error("Error fetching polyline:", err);
    return coordinates.map(([lng, lat]) => [lat, lng]); // fallback to straight lines
  }
};

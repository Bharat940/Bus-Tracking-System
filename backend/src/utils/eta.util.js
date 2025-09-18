const { calculateDistance } = require("./geo.util.js");

exports.calculateETA = (busCoords, stopCoords, avgSpeedKmh = 30) => {
  const [busLat, busLng] = busCoords;
  const [stopLat, stopLng] = stopCoords;
  const distanceKm = calculateDistance(busLat, busLng, stopLat, stopLng);
  const etaMinutes = (distanceKm / avgSpeedKmh) * 60;
  return Math.round(etaMinutes);
};

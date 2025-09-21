import axios from "axios";
import { getToken } from "./auth.service";

const API = "http://localhost:5000/api";

const config = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getRoutes = async () => {
  try {
    const { data } = await axios.get(`${API}/routes`, config());
    return data.data;
  } catch (err) {
    console.error("Error fetching routes:", err);
  }
};

export const getRouteById = async (id) => {
  try {
    const { data } = await axios.get(`${API}/routes/${id}`, config());
    return data.data;
  } catch (err) {
    console.error(`Error fetching route with id ${id}:`, err);
  }
};

export const createRoute = async (route) => {
  try {
    const { data } = await axios.post(`${API}/routes`, route, config());
    return data.data;
  } catch (err) {
    console.error("Error creating route:", err.response?.data || err.message);
    throw err; // re-throw to handle in component
  }
};

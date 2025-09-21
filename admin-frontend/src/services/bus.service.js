import axios from "axios";
import { getToken } from "./auth.service";

const API = "http://localhost:5000/api";
const config = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

const adapt = (res) => {
  if (!res || !res.data) return [];
  if (Array.isArray(res.data)) return res.data;
  if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
  // some controllers may return { success:true, data: {...} }
  if (res.data.data && res.data.data.buses) return res.data.data.buses;
  return [];
};

export const getBuses = async () => {
  try {
    const { data } = await axios.get(`${API}/buses`, config());
    return data.data;
  } catch (err) {
    console.error("Error fetching routes:", err);
  }
};

import axios from "axios";

const BASE = "http://localhost:5000/api/auth";

function extract(res) {
  // backend might return { success:true, data: {...} } or plain { token, user }
  if (!res || !res.data) return null;
  if (res.data.data) return res.data.data;
  return res.data;
}

export async function login(email, password) {
  const res = await axios.post(`${BASE}/login`, { email, password });
  const data = extract(res);
  if (!data) throw new Error("Invalid response from server");
  // store token and user
  const token = data.token ?? data?.token ?? null;
  const user = data.user ?? data?.user ?? null;
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  return { token, user };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

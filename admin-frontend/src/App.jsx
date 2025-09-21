import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRoute from "./pages/CreateRoute";
import { useSelector } from "react-redux";
import AdminDashboard from "./pages/Dashboard";

function PrivateRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-route"
        element={
          <PrivateRoute>
            <CreateRoute />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

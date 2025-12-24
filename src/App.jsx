// src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import { isTokenValid } from "./utils/auth";

import CreateUser from "./pages/users/CreateUser";
import Dashboard from "./layouts/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Roles from "./pages/roles/Roles";
import Users from "./pages/users/Users";

import './App.css';

import { ROLES } from "./data/data";
import Businesses from "./pages/businesses/Businesses";
import { CreateBusinesses } from "./pages/businesses/CreateBusinesses";


export default function App() {

  const tokenOK = isTokenValid();

  return (
    <Routes>
      {/* 🔵 Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Si NO hay token, fuerza login */}
      {!tokenOK && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* 🔵 Rutas protegidas dentro del dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Home por defecto */}
        <Route path="/" element={<Home />} />

        <Route path="/admin/businesses" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Businesses />
          </ProtectedRoute>
        } />

        <Route path="/admin/businesses/create" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <CreateBusinesses />
          </ProtectedRoute>
        } />

        <Route path="/admin/roles" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Roles />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="/admin/users/create" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <CreateUser />
          </ProtectedRoute>
        } />


      </Route>

      {/* Si la ruta no existe, al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

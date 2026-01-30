// src/App.jsx

import './App.css';
import { componentMap } from "./utils/componentMap";
import { getUserFromToken, isTokenValid } from "./utils/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Dashboard from "./layouts/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SpinnerLouder from './components/SpinnerLouder';
import ProtectedRoute from './components/ProtectedRoute';
import Sales from './pages/sales/Sales';
import POSSeller from './layouts/POSSeller';


export default function App() {

  const tokenOK = isTokenValid();

  const [routes, setRoutes] = useState([]);
  const [loadRoutes, setLoadRoutes] = useState(false);
  const [routesSales, setRoutesSales] = useState([]);
  const [loadRoutesSales, setLoadRoutesSales] = useState(false);
  const [businessSelected, setBusinesssSelected] = useState(() => {
    const user = getUserFromToken();

    if (user) return user.businessId
    else return "";
  });

  useEffect(() => {
    if (businessSelected !== "") console.log(`Businness Selected: ${businessSelected}`);
  }, [businessSelected]);

  return (
    <>
      <Routes>
        {/* 🔵 Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Si NO hay token, fuerza login */}
        {/* {!tokenOK && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )} */}

        {/* 🔵 Rutas protegidas dentro del dashboard */}
        <Route element={
          <ProtectedRoute>
            <Dashboard 
              setRoutes={setRoutes} 
              setLoadRoutes={setLoadRoutes} 
              setRoutesSales={setRoutesSales}
              setLoadRoutesSales={setLoadRoutesSales}
              setBusinesssSelected={setBusinesssSelected} />
          </ProtectedRoute>
        }>

          {/* Home por defecto */}
          <Route index element={<Home />} />

          {loadRoutes
            ? routes.map((route, i) => {
              const Component = componentMap[route.component];
              if (!Component) return null;

              return (
                <Route
                  key={i}
                  path={route.route}
                  element={<Component businessSelected={businessSelected} />}
                />
              );
            })
            : <Route path="*" element={<SpinnerLouder height="h-screen" />} />
          }

          {/* Si la ruta no existe dentro del dashboard, al home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>

        <Route path="/sales" element={
          <ProtectedRoute>
            <POSSeller />
          </ProtectedRoute>
        }>
          <Route index element={<Sales />} />

          {loadRoutesSales 
            ? routesSales.map((routeSale, i) => {
              const Component = componentMap[routeSale.component];
              if (!Component) return null;

              return (
                <Route
                  key={i}
                  path={routeSale.route}
                  element={<Component businessSelected={businessSelected} />}
                />
              );
            }) : ""}
        </Route>

      </Routes>
    </>
  );
}
  
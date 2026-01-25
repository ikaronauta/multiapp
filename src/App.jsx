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


export default function App() {

  const tokenOK = isTokenValid();

  const [routes, setRoutes] = useState([]);
  const [loadRoutes, setLoadRoutes] = useState(false);
  const [businessSelected, setBusinesssSelected] = useState(() => {
    const user = getUserFromToken();
    return user.businessId;
  });

  useEffect(() => {
    if(businessSelected !== "") console.log(`Businness Selected: ${businessSelected}`);
  }, [businessSelected]);

  return (
    <>
      <Routes>
        {/* 🔵 Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Si NO hay token, fuerza login */}
        {!tokenOK && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* 🔵 Rutas protegidas dentro del dashboard */}
        <Route element={<Dashboard setRoutes={setRoutes} setLoadRoutes={setLoadRoutes} setBusinesssSelected={setBusinesssSelected} />}>

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

          {/* Si la ruta no existe, al login */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>

        {/* Si la ruta no existe, al login */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </>
  );
}

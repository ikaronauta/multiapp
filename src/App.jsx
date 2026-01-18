// src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import { getUserFromToken, isTokenValid } from "./utils/auth";

import Dashboard from "./layouts/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import './App.css';

import { useRoutesFromDB } from "./hooks/useRoutesFromDB";
import { componentMap } from "./utils/componentMap";
import { useEffect, useState } from "react";
import SpinnerLouder from "./components/SpinnerLouder";
import ModalAlert from "./components/modals/ModalAlert";
import { TriangleAlert } from "lucide-react";


export default function App() {

  const tokenOK = isTokenValid();

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);
  
  const { routes, loading, error } = useRoutesFromDB();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
      setTitleAlert(error.titleAlert || "Atención.");
      setMessageAlert1(error.messageAlert1 || "Algo salió mal.");
      setMessageAlert2(error.messageAlert2 || "");

    }
  }, [error]);

  if (loading) return <SpinnerLouder height="h-screen" />;

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
        <Route element={ <Dashboard /> }>

          {/* Home por defecto */}
          <Route index element={<Home />} />

          {routes.map((route, i) => {
            const Component = componentMap[route.component];

            if (!Component) return null;

            return (
              <Route
                key={i}
                path={route.route}
                element={ <Component />}
              />
            );
          })}

        </Route>

        {/* Si la ruta no existe, al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {showAlert && (
        <ModalAlert
          titleAlert={titleAlert}
          messageAlert1={messageAlert1}
          messageAlert2={messageAlert2}
          textButton="Cerrar" 
          iconComponent={iconComponent}
          onClick={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

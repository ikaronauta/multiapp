// src/layouts/Dashboard.jsx

import { Menu, LogOut, TriangleAlert } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { useRoutesFromDB } from "../hooks/useRoutesFromDB";
import SpinnerLouder from "../components/SpinnerLouder";
import ModalAlert from "../components/modals/ModalAlert";

export default function Dashboard({ setRoutes, setLoadRoutes, setBusinesssSelected }) {

  const { routes, loadingRoutes, error } = useRoutesFromDB();
  
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingRoutes) {
      setRoutes(routes);
      setLoadRoutes(true);
    }
  }, [loadingRoutes, routes]);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
    }
  }, [error]);


  const handleLogout = () => {
    console.log('Logout');
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loadingRoutes) return <SpinnerLouder height="h-screen" />;

  return (
    <>
      <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">

        {/* Botón hamburguesa solo en móvil */}
        <button
          className="lg:hidden absolute top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white"
          onClick={() => setOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen} setBusinesssSelected={setBusinesssSelected} />

        {/* Contenido principal */}
        <main className="flex-1 p-8 pt-16 h-screen overflow-y-auto relative max-w-full overflow-x-hidden">

          {/* Botón de cerrar sesión discreto */}
          <button
            onClick={handleLogout}
            className="fixed top-4 right-4 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition z-50"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>

          <div className="mx-auto h-full">
            <Outlet />
          </div>
        </main>

      </div>

      {showAlert && (
        <ModalAlert
          titleAlert={error.title || "Atención."}
          messageAlert1={error.message1 || "Algo salió mal."}
          messageAlert2={error.message2 || ""}
          textButton="Cerrar" 
          iconComponent={<TriangleAlert className="text-red-600" size={24} />}
          onClick={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

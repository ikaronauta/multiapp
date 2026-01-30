// src/layouts/Dashboard.jsx

import { Menu, LogOut, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRoutesFromDB } from "../hooks/useRoutesFromDB";
import ModalAlert from "../components/modals/ModalAlert";
import Sidebar from "../components/Sidebar";
import SpinnerLouder from "../components/SpinnerLouder";

export default function Dashboard({ setRoutes, setLoadRoutes,
  setRoutesSales, setLoadRoutesSales, setBusinesssSelected }) {

  const { routes, loadingRoutes, error,
    routesSales, loadingRoutesSales, errorSales } = useRoutesFromDB();

  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);

  const activeError = error || errorSales;

  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingRoutes && routes.length > 0) {
      setRoutes(routes);
      setLoadRoutes(true);
    }
  }, [loadingRoutes, routes]);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
    }
  }, [error]);

  useEffect(() => {
    if (!loadingRoutesSales && routesSales.length > 0) {
      setRoutesSales(routesSales);
      setLoadRoutesSales(true);
    }
  }, [loadingRoutesSales, routesSales]);

  useEffect(() => {
    if (errorSales) {
      setShowAlert(true);
    }
  }, [errorSales]);

  const handleLogout = () => {
    console.log('Logout');
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loadingRoutes || loadingRoutesSales)
    return <SpinnerLouder height="h-screen" />;


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
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>

      </div>

      {showAlert && activeError && (
        <ModalAlert
          titleAlert={activeError.title || "Atención"}
          messageAlert1={activeError.message1 || "Algo salió mal"}
          messageAlert2={activeError.message2 || ""}
          textButton="Cerrar"
          iconComponent={<TriangleAlert className="text-red-600" size={24} />}
          onClick={() => setShowAlert(false)}
        />
      )}

    </>
  );
}

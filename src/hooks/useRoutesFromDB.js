// src/hooks/useRoutesFromDB.js

import { useEffect, useState } from "react";
import { getRoutesData } from "../adapters/routes.adapter";

export const useRoutesFromDB = () => {
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRoutesData()
      .then((data) => {
        if (data?.data) {
          setRoutes(data.data);
        } else {
          setError({
            title: "Error al obtener las rutas",
            message1: "Respuesta inválida del servidor",
            message2: data.message || "",
          });
        }
      })
      .catch((err) => {
        setError({
          title: "Error al obtener las rutas",
          message1: err.message,
          message2: err.error?.details || "",
        });
      })
      .finally(() => {
        setLoadingRoutes(false);
      });
  }, []);

  return { routes, loadingRoutes, error };
};

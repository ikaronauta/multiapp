// src/hooks/useRoutesFromDB.js

import { useEffect, useState } from "react";
import { getRoutesData, getRoutesSalesData } from "../adapters/routes.adapter";

export const useRoutesFromDB = () => {
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [error, setError] = useState(null);
  const [routesSales, setRoutesSales] = useState([]);
   const [loadingRoutesSales, setLoadingRoutesSales] = useState(true);
  const [errorSales, setErrorSales] = useState(null);


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

  useEffect(() => {
    getRoutesSalesData()
      .then((data) => {
        if (data?.data) {
          setRoutesSales(data.data);
        } else {
          setErrorSales({
            title: "Error al obtener las rutas del modulo de ventas",
            message1: "Respuesta inválida del servidor",
            message2: data.message || "",
          });
        }
      })
      .catch((err) => {
        setErrorSales({
          title: "Error al obtener las rutas del modulo de ventas",
          message1: err.message,
          message2: err.error?.details || "",
        });
      })
      .finally(() => {
        setLoadingRoutesSales(false);
      });
  }, [routes]);

  return { 
    routes, 
    loadingRoutes, 
    error, 
    routesSales, 
    loadingRoutesSales, 
    errorSales 
  };
};

// src/adapters/routes.adapter.js

import { api } from "../services/api.js";

export const getRoutesData = async () => {

  try {
    const { data } = await api.get(`/routes`);
    return data;
  } catch (error) {
    debugger;
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }


  // El error lo maneja el interceptor en api.js
}
// src/adapters/business.adapter.js

import { api } from "../services/api";
//import { getUserFromToken } from "../utils/auth";


export const getBusinessesData = async () => {
  try {
    //const user = getUserFromToken();
    const { data } = await api.get("/business",);
    return data;
  } catch (error) {
    error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
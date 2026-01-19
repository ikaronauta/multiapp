// src/adapters/modules.adapter.js

import { api } from "../services/api";

export const getModulesData = async () => {
  try {
    const { data } = await api.get("/modules");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
// src/adapters/sectionModules.adapter.js

import { api } from "../services/api";

export const getsectionModules = async () => {
  try {
    const { data } = await api.get("/section_modules");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};
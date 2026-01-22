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

export const newSectionModules = async (formData) => {
  try {
    const { data } = await api.post("/section_modules/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};
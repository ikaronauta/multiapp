// src/adapters/persons.adapter.js

import { api } from "../services/api";

export const getPersonsData = async () => {
  try {
    const { data } = await api.get("/persons");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const newPerson = async (formData) => {
  try {
    const { data } = await api.post("/persons/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
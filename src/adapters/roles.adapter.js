// src/adapters/rolesAdapter.js

import { api } from "../services/api.js";
import { getUserFromToken } from "../utils/auth.js";


export const getRolesData = async () => {
  try {
    const { data } = await api.get(`/roles`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const newRol = async (formData) => {
  try {
    const { data } = await api.post("/roles/newrol", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const deleteRol = async (idRol) => {
  try {
    const { data } = await api.delete(`/roles/deleterol/${idRol}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };;
  }
}

export const editRol = async (idRol, newName) => {
  try {
    const { data } = await api.put(`/roles/updateRol/${idRol}`, { nameRol: newName });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

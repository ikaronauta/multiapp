// src/adapters/rolesAdapter.js

import { api } from "../services/api.js";

export const getRolesData = async () => {
  try {
    const { data } = await api.get(`/roles`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const getRolById = async (id) => {
  try {
    const { data } = await api.get(`/roles/${id}`);
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

export const updatetRol = async (id, formData) => {
  try {
    const { data } = await api.put(`/roles/edit/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

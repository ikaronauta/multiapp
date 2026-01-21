// src/adapters/permissions.adapter.js

import { api } from "../services/api";

export const getPermissionsData = async () => {
  try {
    const { data } = await api.get("/permissions");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const newPermission = async (formData) => {
  try {
    const { data } = await api.post("/permissions/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const getPermissionByUUID = async (id) => {
  try {
    const { data } = await api.get(`/permissions/${id}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const updatetPermission = async (id, formData) => {
  try {
    const { data } = await api.put(`/permissions/edit/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};
// src/adapters/assignedPermissions.adapter.js

import { api } from "../services/api";

export const getAssignedPermissions = async () => {
  try {
    const { data } = await api.get("/assigned_permissions");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const assignPermission = async (formData) => {
  try {
    const { data } = await api.post("/assigned_permissions/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};
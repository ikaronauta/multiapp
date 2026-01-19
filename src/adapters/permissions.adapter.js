// src/adapters/permissions.adapter.js

import { api } from "../services/api";

export const getPermissionsData = async () => {
  try {
    const { data } = await api.get("/permissions");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
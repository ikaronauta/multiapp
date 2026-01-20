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

export const newModule = async (formData) => {
  try {
    const { data } = await api.post("/modules/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const getModuleByUUID = async (id) => {
  try {
    const { data } = await api.get(`/modules/${id}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const updatetModule = async (id, formData) => {
  try {
    const { data } = await api.put(`/modules/edit/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const deleteModule = async (idModule) => {
  try {
    const { data } = await api.delete(`/modules/delete/${idModule}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
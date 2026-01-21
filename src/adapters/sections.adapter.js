// src/adapters/sections.adapter.js

import { api } from "../services/api";

export const getSectionsData = async () => {
  try {
    const { data } = await api.get("/sections");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const newSection = async (formData) => {
  try {
    const { data } = await api.post("/sections/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const getSectionByUUID = async (id) => {
  try {
    const { data } = await api.get(`/sections/${id}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const updatetSection = async (id, formData) => {
  try {
    const { data } = await api.put(`/sections/edit/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const deleteSection = async (id) => {
  try {
    const { data } = await api.delete(`/sections/delete/${id}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};
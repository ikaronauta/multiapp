// src/adapters/users.adapter.js

import { api } from "../services/api";

export const getUsersData = async () => {
  try {
    const { data } = await api.get("/users");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const getUserByUUID = async (id) => {
  try {
    const { data } = await api.get(`/users/${id}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const newUser = async (formData) => {
  try {
    const { data } = await api.post("/users/newuser", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const updateUser = async (id, formData) => {
  try {
    const { data } = await api.put(`/users/edit/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const deleteUser = async (idPerson) => {
  try {
    const { data } = await api.delete(`/users/delete/${idPerson}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
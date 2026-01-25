// src/adapters/utils.adapter.js

import { api } from '../services/api';

export const getDeptos = async () => {
  try {
    const { data } = await api.get("/utils/deptos");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const getCitiesByIdDepto = async (idDepto) => {
  try {
    const { data } = await api.get(`/utils/cities/${idDepto}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const getProductUnits = async () => {
  try {
    const { data } = await api.get("/utils/product_units");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
// src/adapters/products.adapter.js

import { api } from "../services/api";

export const getProductsData = async () => {
  try {
    const { data } = await api.get("/products");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};
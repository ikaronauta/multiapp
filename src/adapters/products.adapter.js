// src/adapters/products.adapter.js

import { api } from "../services/api";

export const getProductsByBusinessIdData = async (businessUUID) => {
  try {
    const { data } = await api.get(`/products/business/${businessUUID}`);
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const getProductsData = async () => {
  try {
    const { data } = await api.get("/products");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const newProduct = async (formData) => {
  try {
    const { data } = await api.post("/products/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};
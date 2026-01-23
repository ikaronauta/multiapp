// src/adapters/productCategories.adapter.js

import { api } from "../services/api";

export const getProductCategoriesData = async () => {
  try {
    const { data } = await api.get("/product_categories");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

export const newProductCategorie = async (formData) => {
  try {
    const { data } = await api.post("/product_categories/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

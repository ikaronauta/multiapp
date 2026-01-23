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
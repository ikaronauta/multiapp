// src/adapters/business.adapter.js

import { api } from "../services/api";
//import { getUserFromToken } from "../utils/auth";


export const getBusinessesData = async () => {
  try {
    //const user = getUserFromToken();
    const { data } = await api.get("/businesses");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const newBusiness = async (formData) => {
  try {
    const { data } = await api.post("/businesses/newbusiness", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
};

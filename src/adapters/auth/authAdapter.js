// src/adapters/auth/authAdapter.js

import { api } from "../../services/api";

export const loginAdapter = async ({ email, password }) => {
  try {

    const { data } = await api.post("/auth/login", { email, password });

    return {
      ok: true,
      token: data.data.token, 
    };
  } catch (err) {
    return {
      ok: false,
      message: err.response?.data?.message || "Error en el servidor",
    };
  }
};

// src/adapters/routes.adapter.js

import { api } from "../services/api.js";

export const getRoutesData = async () => {

  const { data } = await api.get(`/routes`);
  return data;
  // El error lo maneja el interceptor en api.js
}
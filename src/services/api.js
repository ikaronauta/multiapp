// src/services/api.js

import axios from "axios";

export const api = axios.create({
  //baseURL: "http://localhost:4000/api",
  baseURL: "https://684f24f7d099.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 INTERCEPTOR DE REQUEST: agrega token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 👉 INTERCEPTOR DE RESPONSE: detecta token expirado o inválido
api.interceptors.response.use(
  (response) => response, // si todo OK
  (error) => {
    // Si el backend devuelve 401 → Token expirado o inválido
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Redirige inmediatamente al login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

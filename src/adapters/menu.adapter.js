// src/adapters/menu.adapter.js

import { api } from '../services/api';

export const getMenuData = async (selectedBusiness) => {

  // Simulación con setTimeout
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(dataSecciones);
  //   }, 1000);
  // });

  try {
    // const { data } = await api.get("/navbar", {selectedBusiness}); // GET y sin body
    const { data } = await api.get("/navbar", {
      params: { businessId: selectedBusiness }
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    return [];
  }
};

// src/adapters/menuAdapter.js

import { api } from '../services/api';
import { dataSecciones } from '../data/data';

export const getMenuData = async () => {

  // Simulación con setTimeout
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(dataSecciones);
  //   }, 1000);
  // });
  
  try {
    const { data } = await api.get("/sections"); // GET y sin body
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    return [];
  }
};

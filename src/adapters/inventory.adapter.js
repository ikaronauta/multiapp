  // src/adapters/inventory.adapter.js
  
  import { api } from "../services/api";
  
  export const getInventoryData = async (businessSelected) => {
    try {
      const { data } = await api.get(`/inventory?bussinesId=${businessSelected}`);
      return data;
    } catch (error) {
      return error.response?.data ?? { ok: false, message: "Error en la petición" };
    }
  };
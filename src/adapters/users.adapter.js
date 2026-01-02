import { api } from "../services/api";
import { getUserFromToken } from "../utils/auth";

export const getUsersData = async () => {
  try {
    const user = getUserFromToken();
    const { data } = await api.get("/users");
    return data;
  } catch (error) {
    error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const newUser = async (userData) => {
  try {
    const { data } = await api.post("/users/newuser", userData);
    return data;
  } catch (error) {
    error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
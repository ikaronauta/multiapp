import { api } from "../services/api";
import { getUserFromToken } from "../utils/auth";

export const getUsersData = async () => {
  try {
    const user = getUserFromToken();
    const { data } = await api.get("/users");
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}

export const newUser = async (formData) => {
  try {
    const { data } = await api.post("/users/newuser", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return data;
  } catch (error) {
    return error.response?.data ?? { ok: false, message: "Error en la petición" };
  }
}
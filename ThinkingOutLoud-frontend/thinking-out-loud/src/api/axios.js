import axios from "axios";
import { isTokenExpired } from "../utils/auth";
import { navigateTo } from "../utils/navigation";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  console.log("TOKEN BEING SENT:", token);

  if (token) {

    if (isTokenExpired(token)) {

      localStorage.removeItem("token");

      navigateTo("/login");

      return Promise.reject("Token expired");

    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  res => res,
  error => {

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigateTo("/login");
    }

    return Promise.reject(error);
  }
);
export default api;
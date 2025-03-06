// api.ts
import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL as string,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ Header correcto
  }
  return config;
});

export default api;
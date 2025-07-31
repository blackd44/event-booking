import axios, { AxiosError } from "axios";

export const apiUrl = import.meta.env.VITE_API_URL;
export const baseInstance = axios.create({
  baseURL: `${apiUrl || "http://localhost:3000"}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
baseInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Handle token expiration
baseInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      !`${error?.request?.responseURL}`?.includes("/auth/login") &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

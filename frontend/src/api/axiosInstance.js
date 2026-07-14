import axios from "axios";

// Instantiating the global application connection channel linked to the local MERN backend
const API = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Outbound Interceptor: Automatically attaches the token from localStorage if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mediRouteToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
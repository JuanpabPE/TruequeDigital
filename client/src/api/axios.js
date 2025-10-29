import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Interceptor para agregar el token desde localStorage a todas las peticiones
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Enviando token en header Authorization");
      console.log("📏 Token length:", token.length);
      console.log("🎯 Request URL:", config.url);
    } else {
      console.warn("⚠️ No hay token en localStorage");
    }
    return config;
  },
  (error) => {
    console.error("❌ Error en interceptor:", error);
    return Promise.reject(error);
  }
);

export default instance;

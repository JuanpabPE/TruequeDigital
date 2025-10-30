import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      console.log(user);
      const res = await registerRequest(user);
      console.log(res.data);

      // Guardar token en localStorage si viene en la respuesta
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("💾 Token guardado en localStorage");
      }

      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log("✅ LOGIN RESPONSE:", res.data);
      console.log("👤 User ID:", res.data.id);
      console.log("📛 Username:", res.data.username);

      // Guardar token en localStorage si viene en la respuesta
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("💾 Token guardado en localStorage");
      }

      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token"); // Remover también de localStorage
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      // Buscar token primero en cookies, luego en localStorage
      const cookies = Cookies.get();
      const cookieToken = cookies.token;
      const localToken = localStorage.getItem("token");
      const token = cookieToken || localToken;

      console.log("🔍 Checking login...");
      console.log("🍪 Cookie token:", cookieToken ? "✓ Existe" : "✗ No existe");
      console.log(
        "💾 LocalStorage token:",
        localToken ? "✓ Existe" : "✗ No existe"
      );

      if (!token) {
        console.log("❌ No hay token disponible");
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(token);
        console.log("🔄 VERIFY TOKEN RESPONSE:", res.data);
        if (res.data) {
          console.log("👤 Verified User ID:", res.data.id);
          console.log("📛 Verified Username:", res.data.username);
          console.log("🔐 Is Admin:", res.data.isAdmin);
        }
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error verificando token:", error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

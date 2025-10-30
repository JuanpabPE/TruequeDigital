import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

export const authRequired = async (req, res, next) => {
  // Intentar obtener el token desde cookies O desde el header Authorization
  let token = req.cookies.token;
  let source = "cookie";

  if (!token) {
    const authHeader = req.headers.authorization;
    console.log("🔍 AUTH - Authorization header:", authHeader);
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remover "Bearer " del inicio
      source = "header";
      console.log(
        "✅ AUTH - Token extraído del header, longitud:",
        token?.length
      );
    } else {
      console.log("⚠️ AUTH - Header Authorization no tiene formato Bearer");
    }
  } else {
    console.log("✅ AUTH - Token encontrado en cookie");
  }

  if (!token) {
    console.log("❌ AUTH - No token provided (ni cookie ni header)");
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.log("❌ AUTH - Token inválido:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log(`🔑 AUTH - Token válido desde ${source}, user ID:`, decoded.id);

    try {
      // Obtener el usuario completo de la base de datos
      const userFound = await User.findById(decoded.id);
      
      if (!userFound) {
        console.log("❌ AUTH - Usuario no encontrado en BD");
        return res.status(401).json({ message: "User not found" });
      }

      // Guardar usuario completo en req.user (incluyendo isAdmin)
      req.user = {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        isAdmin: userFound.isAdmin || false,
      };

      console.log("👤 AUTH - Usuario autenticado:", req.user.username, "Admin:", req.user.isAdmin);
      next();
    } catch (error) {
      console.log("❌ AUTH - Error obteniendo usuario:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

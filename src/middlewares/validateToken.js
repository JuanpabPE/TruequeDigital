import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
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

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("❌ AUTH - Token inválido:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log(`🔑 AUTH - Token válido desde ${source}, user ID:`, user.id);

    req.user = user;
    next();
  });
};

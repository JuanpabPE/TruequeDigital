import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  // Intentar obtener el token desde cookies O desde el header Authorization
  let token = req.cookies.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remover "Bearer " del inicio
    }
  }

  if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    console.log("🔑 AUTH - Decoded user from token:", user.id);

    req.user = user;
    next();
  });
};

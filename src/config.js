import dotenv from "dotenv";
dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "some secret key";
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/companydb";
export const PORT = process.env.PORT || 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

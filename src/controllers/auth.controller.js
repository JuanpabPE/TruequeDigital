import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userFound = await User.findOne({
      email,
    });

    if (userFound) return res.status(400).json(["The email is already in use"]);

    const passwordHashs = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHashs,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      isAdmin: userSaved.isAdmin || false,
      createAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt,
      token, // Enviar token también en el response para localStorage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({ id: userFound._id });

    console.log("🔐 LOGIN - User:", userFound.username, "ID:", userFound._id);
    console.log("🍪 TOKEN CREATED for user ID:", userFound._id);
    console.log("📤 Enviando token en response body para localStorage");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isAdmin: userFound.isAdmin || false,
      createAt: userFound.createdAt,
      updateAt: userFound.updatedAt,
      token, // Enviar token también en el response para localStorage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createAt: userFound.createdAt,
    updateAt: userFound.updatedAt,
  });
  res.send("profile");
};

export const verifyToken = async (req, res) => {
  // Buscar token en cookies o en el header Authorization
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("❌ No token found in cookies or headers");
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("🔍 Verifying token...");

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userFound = await User.findById(decoded.id);
    if (!userFound) {
      console.log("❌ User not found for token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(
      "✅ Token verified for user:",
      userFound.username,
      "Admin:",
      userFound.isAdmin
    );

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isAdmin: userFound.isAdmin || false,
    });
  });
};

import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "2.0.0-localStorage-support", // Versión actualizada
    middleware: "Acepta token de header Authorization",
  });
});

export default router;

import { Router } from "express";
import {
  createExchange,
  getExchanges,
  getExchangeById,
  getMyExchanges,
  updateExchange,
  deleteExchange,
  updateExchangeStatus,
} from "../controllers/exchanges.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { requireActiveMembership } from "../middlewares/requireMembership.js";

const router = Router();

// Rutas públicas (cualquier usuario autenticado puede ver)
router.get("/exchanges", authRequired, getExchanges);
router.get("/exchanges/:id", authRequired, getExchangeById);

// Rutas protegidas (requieren membresía activa)
router.post("/exchanges", authRequired, requireActiveMembership, createExchange);
router.get("/my-exchanges", authRequired, requireActiveMembership, getMyExchanges);
router.put("/exchanges/:id", authRequired, requireActiveMembership, updateExchange);
router.delete("/exchanges/:id", authRequired, requireActiveMembership, deleteExchange);
router.patch("/exchanges/:id/status", authRequired, requireActiveMembership, updateExchangeStatus);

export default router;

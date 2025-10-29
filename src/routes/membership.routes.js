import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getPlans,
  createMembership,
  getActiveMembership,
  getMembershipHistory,
  cancelMembership,
  renewMembership,
  autoApproveMembership,
} from "../controllers/membership.controller.js";

const router = Router();

// Rutas públicas (o protegidas solo por auth)
router.get("/plans", getPlans); // Puede ser pública

// Rutas protegidas (requieren autenticación)
router.post("/memberships", authRequired, createMembership);
router.get("/memberships/active", authRequired, getActiveMembership);
router.get("/memberships/history", authRequired, getMembershipHistory);
router.post("/memberships/cancel", authRequired, cancelMembership);
router.post("/memberships/renew", authRequired, renewMembership);

// Ruta de desarrollo para auto-aprobar membresías pendientes
router.post("/memberships/auto-approve", authRequired, autoApproveMembership);

export default router;

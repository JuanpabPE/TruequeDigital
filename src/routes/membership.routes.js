import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/upload.js";
import {
  getPlans,
  createMembership,
  getActiveMembership,
  getMembershipHistory,
  cancelMembership,
  renewMembership,
  autoApproveMembership,
  uploadPaymentProof,
  getPendingMemberships,
  approveMembership,
  rejectMembership,
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
router.post(
  "/memberships/upload-proof",
  authRequired,
  upload.single("image"),
  uploadPaymentProof
);

// Ruta de desarrollo para auto-aprobar membresías pendientes
router.post("/memberships/auto-approve", authRequired, autoApproveMembership);

// Rutas de administración (TODO: agregar middleware de admin)
router.get("/admin/memberships/pending", authRequired, getPendingMemberships);
router.post("/admin/memberships/:membershipId/approve", authRequired, approveMembership);
router.post("/admin/memberships/:membershipId/reject", authRequired, rejectMembership);

export default router;

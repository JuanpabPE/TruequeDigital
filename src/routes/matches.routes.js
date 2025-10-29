import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { requireActiveMembership } from "../middlewares/requireMembership.js";
import {
  requestMatch,
  getSentMatches,
  getReceivedMatches,
  getMatchById,
  acceptMatch,
  rejectMatch,
  cancelMatch,
  sendMessage,
  updateMeetingDetails,
  completeMatch,
  getNotificationsCount,
} from "../controllers/matches.controller.js";

const router = Router();

// Todas las rutas requieren autenticación y membresía activa
router.use(authRequired);
router.use(requireActiveMembership);

// Crear solicitud de match
router.post("/", requestMatch);

// Obtener matches enviados
router.get("/sent", getSentMatches);

// Obtener matches recibidos
router.get("/received", getReceivedMatches);

// Obtener contador de notificaciones
router.get("/notifications/count", getNotificationsCount);

// Obtener un match específico
router.get("/:id", getMatchById);

// Aceptar match
router.put("/:id/accept", acceptMatch);

// Rechazar match
router.put("/:id/reject", rejectMatch);

// Cancelar match (solo el requester, solo si está pending)
router.put("/:id/cancel", cancelMatch);

// Enviar mensaje en el chat
router.post("/:id/messages", sendMessage);

// Actualizar detalles del encuentro
router.put("/:id/meeting", updateMeetingDetails);

// Marcar match como completado
router.put("/:id/complete", completeMatch);

export default router;

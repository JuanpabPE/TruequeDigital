import axios from "./axios.js";

// Crear solicitud de match
export const requestMatchRequest = (data) => axios.post("/matches", data);

// Obtener matches enviados
export const getSentMatchesRequest = (status) =>
  axios.get(`/matches/sent${status ? `?status=${status}` : ""}`);

// Obtener matches recibidos
export const getReceivedMatchesRequest = (status) =>
  axios.get(`/matches/received${status ? `?status=${status}` : ""}`);

// Obtener un match por ID
export const getMatchByIdRequest = (id) => axios.get(`/matches/${id}`);

// Aceptar match
export const acceptMatchRequest = (id) => axios.put(`/matches/${id}/accept`);

// Rechazar match
export const rejectMatchRequest = (id, data) =>
  axios.put(`/matches/${id}/reject`, data);

// Cancelar match
export const cancelMatchRequest = (id) => axios.put(`/matches/${id}/cancel`);

// Enviar mensaje
export const sendMessageRequest = (id, data) =>
  axios.post(`/matches/${id}/messages`, data);

// Actualizar detalles del encuentro
export const updateMeetingDetailsRequest = (id, data) =>
  axios.put(`/matches/${id}/meeting`, data);

// Completar match
export const completeMatchRequest = (id) =>
  axios.put(`/matches/${id}/complete`);

// Obtener contador de notificaciones
export const getNotificationsCountRequest = () =>
  axios.get("/matches/notifications/count");

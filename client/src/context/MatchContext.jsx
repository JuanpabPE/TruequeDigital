import { createContext, useContext, useState } from "react";
import {
  requestMatchRequest,
  getSentMatchesRequest,
  getReceivedMatchesRequest,
  getMatchByIdRequest,
  acceptMatchRequest,
  rejectMatchRequest,
  cancelMatchRequest,
  sendMessageRequest,
  updateMeetingDetailsRequest,
  completeMatchRequest,
  getNotificationsCountRequest,
  deleteMatchRequest,
} from "../api/matches.js";

const MatchContext = createContext();

export const useMatches = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchProvider");
  }
  return context;
};

export function MatchProvider({ children }) {
  const [sentMatches, setSentMatches] = useState([]);
  const [receivedMatches, setReceivedMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState({
    pendingMatches: 0,
    unreadMessages: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Crear solicitud de match
  const requestMatch = async (data) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await requestMatchRequest(data);
      // Actualizar la lista de enviados
      setSentMatches((prev) => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      console.error("Error al solicitar match:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al solicitar match"]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener matches enviados
  const getSentMatches = async (status = null) => {
    try {
      setLoading(true);
      const res = await getSentMatchesRequest(status);
      setSentMatches(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener matches enviados:", error);
      setErrors(["Error al obtener matches enviados"]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener matches recibidos
  const getReceivedMatches = async (status = null) => {
    try {
      setLoading(true);
      const res = await getReceivedMatchesRequest(status);
      setReceivedMatches(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener matches recibidos:", error);
      setErrors(["Error al obtener matches recibidos"]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un match por ID
  const getMatchById = async (id) => {
    try {
      setLoading(true);
      const res = await getMatchByIdRequest(id);
      setCurrentMatch(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener match:", error);
      setErrors(["Error al obtener match"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refrescar mensajes silenciosamente (sin loading)
  const refreshMessages = async (id) => {
    try {
      const res = await getMatchByIdRequest(id);
      // Actualizar mensajes, meetingDetails, status Y completionConfirmation si cambiaron
      if (currentMatch) {
        const messagesChanged = res.data.messages.length !== currentMatch.messages?.length;
        const meetingChanged = JSON.stringify(res.data.meetingDetails) !== JSON.stringify(currentMatch.meetingDetails);
        const statusChanged = res.data.status !== currentMatch.status;
        const confirmationChanged = JSON.stringify(res.data.completionConfirmation) !== JSON.stringify(currentMatch.completionConfirmation);
        
        if (messagesChanged || meetingChanged || statusChanged || confirmationChanged) {
          setCurrentMatch((prev) => ({
            ...prev,
            messages: res.data.messages,
            meetingDetails: res.data.meetingDetails,
            status: res.data.status, // Sincronizar el estado
            completionConfirmation: res.data.completionConfirmation, // Sincronizar confirmaciones
          }));
        }
      }
      return res.data;
    } catch (error) {
      // Silencioso - no mostrar error al usuario
      console.error("Error al refrescar mensajes:", error);
    }
  };

  // Aceptar match
  const acceptMatch = async (id) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await acceptMatchRequest(id);
      // Actualizar la lista de recibidos
      setReceivedMatches((prev) =>
        prev.map((match) => (match._id === id ? res.data : match))
      );
      // Si es el match actual, actualizarlo
      if (currentMatch?._id === id) {
        setCurrentMatch(res.data);
      }
      // Actualizar contador de notificaciones
      await getNotificationsCount();
      return res.data;
    } catch (error) {
      console.error("Error al aceptar match:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al aceptar match"]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Rechazar match
  const rejectMatch = async (id, rejectionReason = "") => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await rejectMatchRequest(id, { rejectionReason });
      // Actualizar la lista de recibidos
      setReceivedMatches((prev) =>
        prev.map((match) => (match._id === id ? res.data : match))
      );
      // Si es el match actual, actualizarlo
      if (currentMatch?._id === id) {
        setCurrentMatch(res.data);
      }
      // Actualizar contador de notificaciones
      await getNotificationsCount();
      return res.data;
    } catch (error) {
      console.error("Error al rechazar match:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al rechazar match"]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar match
  const cancelMatch = async (id) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await cancelMatchRequest(id);
      // Actualizar la lista de enviados
      setSentMatches((prev) =>
        prev.map((match) => (match._id === id ? res.data.match : match))
      );
      return res.data;
    } catch (error) {
      console.error("Error al cancelar match:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al cancelar match"]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensaje
  const sendMessage = async (matchId, content) => {
    try {
      const res = await sendMessageRequest(matchId, { content });
      // Actualizar el match actual con el nuevo mensaje
      if (currentMatch?._id === matchId) {
        setCurrentMatch((prev) => ({
          ...prev,
          messages: [...prev.messages, res.data],
        }));
      }
      return res.data;
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al enviar mensaje"]
      );
      throw error;
    }
  };

  // Actualizar detalles del encuentro
  const updateMeetingDetails = async (matchId, details) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await updateMeetingDetailsRequest(matchId, details);
      // Actualizar solo meetingDetails, preservar el resto del match
      if (currentMatch?._id === matchId) {
        setCurrentMatch((prev) => ({
          ...prev,
          meetingDetails: res.data.meetingDetails,
        }));
      }
      return res.data;
    } catch (error) {
      console.error("Error al actualizar detalles:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al actualizar detalles"]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Completar match
  const completeMatch = async (matchId) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await completeMatchRequest(matchId);
      // Actualizar el match actual
      if (currentMatch?._id === matchId) {
        setCurrentMatch(res.data.match);
      }
      // Actualizar listas
      setSentMatches((prev) =>
        prev.map((match) => (match._id === matchId ? res.data.match : match))
      );
      setReceivedMatches((prev) =>
        prev.map((match) => (match._id === matchId ? res.data.match : match))
      );
      return res.data;
    } catch (error) {
      console.error("Error al completar match:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al completar match"]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener contador de notificaciones
  const getNotificationsCount = async () => {
    try {
      const res = await getNotificationsCountRequest();
      setNotificationsCount(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener contador:", error);
    }
  };

  // Eliminar match
  const deleteMatch = async (matchId) => {
    try {
      setLoading(true);
      setErrors([]);
      await deleteMatchRequest(matchId);
      // Eliminar de las listas
      setSentMatches((prev) => prev.filter((match) => match._id !== matchId));
      setReceivedMatches((prev) =>
        prev.filter((match) => match._id !== matchId)
      );
      // Si es el match actual, limpiarlo
      if (currentMatch?._id === matchId) {
        setCurrentMatch(null);
      }
      return true;
    } catch (error) {
      console.error("Error al eliminar match:", error);
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al eliminar match"]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar errores
  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <MatchContext.Provider
      value={{
        sentMatches,
        receivedMatches,
        currentMatch,
        notificationsCount,
        loading,
        errors,
        requestMatch,
        getSentMatches,
        getReceivedMatches,
        getMatchById,
        refreshMessages,
        acceptMatch,
        rejectMatch,
        cancelMatch,
        sendMessage,
        updateMeetingDetails,
        completeMatch,
        getNotificationsCount,
        deleteMatch,
        clearErrors,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}

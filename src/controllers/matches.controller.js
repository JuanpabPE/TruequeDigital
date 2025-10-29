import Match from "../models/match.model.js";
import Exchange from "../models/exchange.model.js";
import User from "../models/user.model.js";

// Crear solicitud de match (intercambio)
export const requestMatch = async (req, res) => {
  try {
    const { exchangeOfferedId, exchangeRequestedId, initialMessage } = req.body;

    // Validar que ambos exchanges existan
    const exchangeOffered = await Exchange.findById(exchangeOfferedId);
    const exchangeRequested = await Exchange.findById(exchangeRequestedId);

    if (!exchangeOffered || !exchangeRequested) {
      return res.status(404).json({ message: "Exchange no encontrado" });
    }

    // Validar que el exchange ofrecido pertenezca al usuario actual
    if (exchangeOffered.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No puedes ofrecer un exchange que no es tuyo" });
    }

    // Validar que no esté intentando hacer match con su propio exchange
    if (exchangeRequested.user.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "No puedes solicitar tu propio exchange" });
    }

    // Validar que ambos exchanges estén disponibles
    if (exchangeOffered.status !== "disponible") {
      return res
        .status(400)
        .json({ message: "Tu exchange no está disponible" });
    }

    if (exchangeRequested.status !== "disponible") {
      return res
        .status(400)
        .json({ message: "El exchange solicitado no está disponible" });
    }

    // Validar que no exista un match pendiente duplicado
    const duplicateMatch = await Match.findDuplicatePending(
      req.user.id,
      exchangeOfferedId,
      exchangeRequestedId
    );

    if (duplicateMatch) {
      return res.status(400).json({
        message: "Ya tienes una solicitud pendiente para este intercambio",
      });
    }

    // Crear el match
    const newMatch = new Match({
      requester: req.user.id,
      requestedUser: exchangeRequested.user,
      exchangeOffered: exchangeOfferedId,
      exchangeRequested: exchangeRequestedId,
      initialMessage: initialMessage || "",
      status: "pending",
    });

    const savedMatch = await newMatch.save();

    // Poblar la información antes de devolver
    const populatedMatch = await Match.findById(savedMatch._id)
      .populate("requester", "username email")
      .populate("requestedUser", "username email")
      .populate("exchangeOffered")
      .populate("exchangeRequested");

    res.status(201).json(populatedMatch);
  } catch (error) {
    console.error("Error al crear match:", error);
    res.status(500).json({ message: "Error al crear solicitud de match" });
  }
};

// Obtener matches enviados por el usuario actual
export const getSentMatches = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { requester: req.user.id };
    if (status) {
      filter.status = status;
    }

    const matches = await Match.find(filter)
      .populate("requester", "username email")
      .populate("requestedUser", "username email")
      .populate("exchangeOffered")
      .populate("exchangeRequested")
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    console.error("Error al obtener matches enviados:", error);
    res.status(500).json({ message: "Error al obtener matches enviados" });
  }
};

// Obtener matches recibidos por el usuario actual
export const getReceivedMatches = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { requestedUser: req.user.id };
    if (status) {
      filter.status = status;
    }

    const matches = await Match.find(filter)
      .populate("requester", "username email")
      .populate("requestedUser", "username email")
      .populate("exchangeOffered")
      .populate("exchangeRequested")
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    console.error("Error al obtener matches recibidos:", error);
    res.status(500).json({ message: "Error al obtener matches recibidos" });
  }
};

// Obtener un match por ID
export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id)
      .populate("requester", "username email whatsapp")
      .populate("requestedUser", "username email whatsapp")
      .populate("exchangeOffered")
      .populate("exchangeRequested")
      .populate("messages.sender", "username");

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado" });
    }

    // Verificar que el usuario sea parte del match
    const isParticipant =
      match.requester._id.toString() === req.user.id ||
      match.requestedUser._id.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "No tienes acceso a este match" });
    }

    // Marcar mensajes como leídos
    match.markMessagesAsRead(req.user.id);
    await match.save();

    res.json(match);
  } catch (error) {
    console.error("Error al obtener match:", error);
    res.status(500).json({ message: "Error al obtener match" });
  }
};

// Aceptar un match
export const acceptMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id)
      .populate("requester", "username email whatsapp")
      .populate("requestedUser", "username email whatsapp")
      .populate("exchangeOffered")
      .populate("exchangeRequested");

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado" });
    }

    // Verificar que el usuario sea el requestedUser
    if (match.requestedUser._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para aceptar este match" });
    }

    // Verificar que el match esté pendiente
    if (match.status !== "pending") {
      return res.status(400).json({ message: "Este match ya fue respondido" });
    }

    // Actualizar estado
    match.status = "accepted";
    match.acceptedAt = new Date();
    match.respondedAt = new Date();
    match.contactShared = true;

    await match.save();

    res.json(match);
  } catch (error) {
    console.error("Error al aceptar match:", error);
    res.status(500).json({ message: "Error al aceptar match" });
  }
};

// Rechazar un match
export const rejectMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const match = await Match.findById(id)
      .populate("requester", "username email")
      .populate("requestedUser", "username email")
      .populate("exchangeOffered")
      .populate("exchangeRequested");

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado" });
    }

    // Verificar que el usuario sea el requestedUser
    if (match.requestedUser._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para rechazar este match" });
    }

    // Verificar que el match esté pendiente
    if (match.status !== "pending") {
      return res.status(400).json({ message: "Este match ya fue respondido" });
    }

    // Actualizar estado
    match.status = "rejected";
    match.respondedAt = new Date();
    if (rejectionReason) {
      match.rejectionReason = rejectionReason;
    }

    await match.save();

    res.json(match);
  } catch (error) {
    console.error("Error al rechazar match:", error);
    res.status(500).json({ message: "Error al rechazar match" });
  }
};

// Cancelar un match (solo el requester puede cancelar si está pending)
export const cancelMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id);

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado" });
    }

    // Verificar que el usuario sea el requester
    if (match.requester.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para cancelar este match" });
    }

    // Solo se puede cancelar si está pending
    if (match.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Solo puedes cancelar matches pendientes" });
    }

    match.status = "cancelled";
    await match.save();

    res.json({ message: "Match cancelado exitosamente", match });
  } catch (error) {
    console.error("Error al cancelar match:", error);
    res.status(500).json({ message: "Error al cancelar match" });
  }
};

// Enviar mensaje en el chat del match
export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "El mensaje no puede estar vacío" });
    }

    const match = await Match.findById(id).populate(
      "messages.sender",
      "username"
    );

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado" });
    }

    // Verificar que el usuario sea parte del match
    const isParticipant =
      match.requester.toString() === req.user.id ||
      match.requestedUser.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "No tienes acceso a este chat" });
    }

    // Solo se puede chatear en matches aceptados
    if (match.status !== "accepted" && match.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Solo puedes chatear en matches aceptados" });
    }

    // Agregar mensaje
    match.messages.push({
      sender: req.user.id,
      content: content.trim(),
      timestamp: new Date(),
      isRead: false,
    });

    await match.save();

    // Poblar el último mensaje agregado
    const populatedMatch = await Match.findById(match._id).populate(
      "messages.sender",
      "username"
    );

    const newMessage =
      populatedMatch.messages[populatedMatch.messages.length - 1];

    res.json(newMessage);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ message: "Error al enviar mensaje" });
  }
};

// Actualizar detalles del encuentro
export const updateMeetingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, location, notes } = req.body;

    const match = await Match.findById(id);

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado" });
    }

    // Verificar que el usuario sea parte del match
    const isParticipant =
      match.requester.toString() === req.user.id ||
      match.requestedUser.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "No tienes acceso a este match" });
    }

    // Solo se pueden actualizar detalles en matches aceptados
    if (match.status !== "accepted" && match.status !== "completed") {
      return res.status(400).json({
        message: "Solo puedes actualizar detalles en matches aceptados",
      });
    }

    // Actualizar detalles
    if (date) match.meetingDetails.date = date;
    if (location) match.meetingDetails.location = location;
    if (notes !== undefined) match.meetingDetails.notes = notes;

    await match.save();

    res.json(match);
  } catch (error) {
    console.error("Error al actualizar detalles del encuentro:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar detalles del encuentro" });
  }
};

// Marcar match como completado
export const completeMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id)
      .populate("exchangeOffered")
      .populate("exchangeRequested");

    if (!match) {
      return res.status(404).json({ message: "Match no encontrado" });
    }

    // Verificar que el usuario sea parte del match
    const isParticipant =
      match.requester.toString() === req.user.id ||
      match.requestedUser.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: "No tienes acceso a este match" });
    }

    // Solo se puede completar un match aceptado
    if (match.status !== "accepted") {
      return res.status(400).json({
        message: "Solo puedes completar matches aceptados",
      });
    }

    // Marcar como completado
    match.status = "completed";
    match.completedAt = new Date();

    // Actualizar estado de los exchanges a "intercambiado"
    await Exchange.findByIdAndUpdate(match.exchangeOffered._id, {
      status: "intercambiado",
    });
    await Exchange.findByIdAndUpdate(match.exchangeRequested._id, {
      status: "intercambiado",
    });

    await match.save();

    res.json({ message: "Match completado exitosamente", match });
  } catch (error) {
    console.error("Error al completar match:", error);
    res.status(500).json({ message: "Error al completar match" });
  }
};

// Obtener contador de notificaciones (matches pendientes recibidos)
export const getNotificationsCount = async (req, res) => {
  try {
    const pendingCount = await Match.countDocuments({
      requestedUser: req.user.id,
      status: "pending",
    });

    // Contar mensajes no leídos en matches aceptados
    const acceptedMatches = await Match.find({
      $or: [{ requester: req.user.id }, { requestedUser: req.user.id }],
      status: { $in: ["accepted", "completed"] },
    });

    let unreadMessagesCount = 0;
    acceptedMatches.forEach((match) => {
      unreadMessagesCount += match.getUnreadMessagesCount(req.user.id);
    });

    res.json({
      pendingMatches: pendingCount,
      unreadMessages: unreadMessagesCount,
      total: pendingCount + unreadMessagesCount,
    });
  } catch (error) {
    console.error("Error al obtener contador de notificaciones:", error);
    res
      .status(500)
      .json({ message: "Error al obtener contador de notificaciones" });
  }
};

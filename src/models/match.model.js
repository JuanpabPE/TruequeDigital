import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    // Usuario que solicita el intercambio
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Usuario que recibe la solicitud (dueño del exchange solicitado)
    requestedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Exchange que el requester ofrece (su propio exchange)
    exchangeOffered: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
      required: true,
    },

    // Exchange que el requester quiere (del requestedUser)
    exchangeRequested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
      required: true,
    },

    // Mensaje inicial del requester
    initialMessage: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Estado del match
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    // Chat/mensajes entre ambos usuarios
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: 1000,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Detalles del encuentro/intercambio
    meetingDetails: {
      date: Date,
      location: String,
      notes: String,
    },

    // Información de contacto compartida al aceptar
    contactShared: {
      type: Boolean,
      default: false,
    },

    // Razón de rechazo (opcional)
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // Fecha de respuesta (aceptado/rechazado)
    respondedAt: Date,

    // Fecha de aceptación
    acceptedAt: Date,

    // Confirmaciones de completado (bilateral)
    completionConfirmation: {
      requesterConfirmed: {
        type: Boolean,
        default: false,
      },
      requesterConfirmedAt: Date,
      requestedUserConfirmed: {
        type: Boolean,
        default: false,
      },
      requestedUserConfirmedAt: Date,
    },

    // Fecha de completado (cuando ambos confirmen)
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Índices para consultas eficientes
matchSchema.index({ exchangeRequested: 1, status: 1 });
matchSchema.index({ exchangeOffered: 1, status: 1 });
matchSchema.index({ requester: 1, status: 1 });
matchSchema.index({ requestedUser: 1, status: 1 });
matchSchema.index({ status: 1, createdAt: -1 });

// Método para validar que no haya match duplicado pendiente
matchSchema.statics.findDuplicatePending = async function (
  requester,
  exchangeOffered,
  exchangeRequested
) {
  return await this.findOne({
    requester,
    exchangeOffered,
    exchangeRequested,
    status: "pending",
  });
};

// Método para obtener cantidad de mensajes no leídos para un usuario
matchSchema.methods.getUnreadMessagesCount = function (userId) {
  return this.messages.filter(
    (msg) => !msg.isRead && msg.sender.toString() !== userId.toString()
  ).length;
};

// Método para marcar mensajes como leídos
matchSchema.methods.markMessagesAsRead = function (userId) {
  this.messages.forEach((msg) => {
    if (msg.sender.toString() !== userId.toString() && !msg.isRead) {
      msg.isRead = true;
    }
  });
};

export default mongoose.model("Match", matchSchema);

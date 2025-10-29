import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    exchange: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Qué ofrece el solicitante a cambio
    offerDescription: {
      type: String,
      required: true,
      maxlength: 500,
    },
    offerImages: [
      {
        type: String, // URLs de imágenes de lo que ofrece
      },
    ],
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
    // Fecha de aceptación
    acceptedAt: Date,
    // Fecha de completado
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Índices para consultas eficientes
matchSchema.index({ exchange: 1, status: 1 });
matchSchema.index({ requester: 1, status: 1 });
matchSchema.index({ owner: 1, status: 1 });

export default mongoose.model("Match", matchSchema);

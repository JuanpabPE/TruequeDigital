import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["basic", "standard", "premium"], // S/5, S/15, S/30
      required: true,
      default: "basic",
    },
    price: {
      type: Number,
      required: true,
    },
    exchangesAllowed: {
      type: Number,
      required: true,
      default: 3, // básico: 3, standard: 12, premium: 30
    },
    exchangesUsed: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["yape", "plin", "card", "whatsapp"],
      default: "whatsapp",
    },
    paymentProof: {
      type: String, // URL de la imagen del comprobante
      default: "",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Método para verificar si la membresía está activa
membershipSchema.methods.isActive = function () {
  return this.status === "active" && this.endDate > new Date();
};

// Método para verificar si aún tiene intercambios disponibles
membershipSchema.methods.hasExchangesAvailable = function () {
  return this.exchangesUsed < this.exchangesAllowed;
};

// Método para usar un intercambio
membershipSchema.methods.useExchange = function () {
  if (this.hasExchangesAvailable()) {
    this.exchangesUsed += 1;
    return true;
  }
  return false;
};

// Método estático para calcular fecha de fin según el plan
membershipSchema.statics.calculateEndDate = function (
  plan,
  startDate = new Date()
) {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + 1); // Todos los planes son mensuales
  return date;
};

export default mongoose.model("Membership", membershipSchema);

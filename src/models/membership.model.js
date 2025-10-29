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
      enum: ["active", "expired", "cancelled"],
      default: "active",
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

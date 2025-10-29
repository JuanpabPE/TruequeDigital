import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Nuevos campos para Cambia y Gana
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    university: {
      type: String,
      trim: true,
      default: "",
    },
    career: {
      type: String,
      trim: true,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    // Membresía activa
    activeMembership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      default: null,
    },
    // Reputación promedio (1-5)
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    // Contador de trueques completados
    completedExchanges: {
      type: Number,
      default: 0,
    },
    // Estado de la cuenta
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    // Lo que ofrece
    offering: {
      category: {
        type: String,
        enum: [
          "Electrónica",
          "Libros",
          "Ropa",
          "Deportes",
          "Música",
          "Arte",
          "Hogar",
          "Videojuegos",
          "Accesorios",
          "Servicios",
          "Otro",
        ],
        required: true,
      },
      condition: {
        type: String,
        enum: ["new", "like-new", "good", "fair"],
        default: "good",
      },
      estimatedValue: {
        type: Number,
        default: 0,
      },
    },
    // Lo que busca a cambio
    seeking: {
      category: {
        type: String,
        enum: [
          "Electrónica",
          "Libros",
          "Ropa",
          "Deportes",
          "Música",
          "Arte",
          "Hogar",
          "Videojuegos",
          "Accesorios",
          "Servicios",
          "Otro",
        ],
        required: true,
      },
      description: {
        type: String,
        maxlength: 500,
      },
    },
    images: [
      {
        type: String, // URLs de las imágenes
      },
    ],
    location: {
      type: String,
      trim: true,
      default: "",
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "disponible",
        "pausado",
        "en-progreso",
        "intercambiado",
        "cancelado",
      ],
      default: "disponible",
    },
    views: {
      type: Number,
      default: 0,
    },
    // Match aceptado (si existe)
    acceptedMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas
exchangeSchema.index({ "offering.category": 1, status: 1 });
exchangeSchema.index({ "seeking.category": 1, status: 1 });

export default mongoose.model("Exchange", exchangeSchema);

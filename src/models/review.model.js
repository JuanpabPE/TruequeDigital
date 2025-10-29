import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
      default: "",
    },
    // Criterios específicos (opcional)
    criteria: {
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      punctuality: {
        type: Number,
        min: 1,
        max: 5,
      },
      itemCondition: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Evitar reviews duplicados para el mismo match
reviewSchema.index({ match: 1, reviewer: 1 }, { unique: true });

// Índice para obtener reviews de un usuario
reviewSchema.index({ reviewedUser: 1 });

export default mongoose.model("Review", reviewSchema);

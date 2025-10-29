// Script para activar membresías pendientes automáticamente
// Uso: node scripts/activar-membresias.js

import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Modelo simplificado de Membership
const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "expired", "cancelled"],
    default: "pending",
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const Membership = mongoose.model("Membership", membershipSchema);

// Modelo simplificado de User
const userSchema = new mongoose.Schema({
  username: String,
  activeMembership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Membership",
  },
});

const User = mongoose.model("User", userSchema);

async function activarMembresias() {
  try {
    console.log("🔌 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    // Buscar todas las membresías pendientes
    const membresiasPendientes = await Membership.find({
      status: "pending",
    }).populate("user", "username email");

    if (membresiasPendientes.length === 0) {
      console.log("✨ No hay membresías pendientes para activar");
      process.exit(0);
    }

    console.log(
      `📋 Encontradas ${membresiasPendientes.length} membresías pendientes:\n`
    );

    // Activar cada membresía
    for (const membresia of membresiasPendientes) {
      console.log(`👤 Usuario: ${membresia.user.username}`);
      console.log(`📦 Plan: ${membresia.plan}`);
      console.log(`🆔 Membresía ID: ${membresia._id}`);

      // Actualizar membresía
      membresia.status = "active";
      const now = new Date();
      membresia.startDate = now;

      // Duración según el plan
      const endDate = new Date(now);
      if (membresia.plan === "basic") {
        endDate.setDate(endDate.getDate() + 30); // 1 mes
      } else if (membresia.plan === "standard") {
        endDate.setDate(endDate.getDate() + 30); // 1 mes
      } else if (membresia.plan === "premium") {
        endDate.setDate(endDate.getDate() + 30); // 1 mes
      }
      membresia.endDate = endDate;

      await membresia.save();

      // Actualizar usuario
      await User.findByIdAndUpdate(membresia.user._id, {
        activeMembership: membresia._id,
      });

      console.log(`✅ Membresía activada exitosamente`);
      console.log(
        `📅 Fecha inicio: ${membresia.startDate.toLocaleDateString()}`
      );
      console.log(`📅 Fecha fin: ${membresia.endDate.toLocaleDateString()}`);
      console.log("─".repeat(50) + "\n");
    }

    console.log(
      `🎉 Se activaron ${membresiasPendientes.length} membresías exitosamente`
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Desconectado de MongoDB");
    process.exit(0);
  }
}

// Ejecutar
activarMembresias();

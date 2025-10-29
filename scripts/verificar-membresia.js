// Script para verificar el estado de una membresía específica
// Uso: node scripts/verificar-membresia.js <membership_id>

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: String,
  status: String,
  startDate: Date,
  endDate: Date,
  createdAt: Date,
});

const Membership = mongoose.model("Membership", membershipSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  activeMembership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Membership",
  },
});

const User = mongoose.model("User", userSchema);

async function verificarMembresia() {
  try {
    console.log("🔌 Conectando a MongoDB...\n");
    await mongoose.connect(process.env.MONGODB_URI);

    // Buscar Usuario 102
    const usuario102 = await User.findOne({ username: "hola102" }).populate(
      "activeMembership"
    );

    if (!usuario102) {
      console.log("❌ Usuario 'hola102' no encontrado");
      process.exit(1);
    }

    console.log("👤 USUARIO 102:");
    console.log(`   Username: ${usuario102.username}`);
    console.log(`   Email: ${usuario102.email}`);
    console.log(`   User ID: ${usuario102._id}`);
    console.log(
      `   Active Membership ID: ${usuario102.activeMembership || "null"}\n`
    );

    if (usuario102.activeMembership) {
      const membresia = await Membership.findById(usuario102.activeMembership);

      if (membresia) {
        console.log("📋 MEMBRESÍA:");
        console.log(`   ID: ${membresia._id}`);
        console.log(`   Plan: ${membresia.plan}`);
        console.log(`   Estado: ${membresia.status}`);
        console.log(
          `   Fecha inicio: ${membresia.startDate ? membresia.startDate.toLocaleString() : "No definida"}`
        );
        console.log(
          `   Fecha fin: ${membresia.endDate ? membresia.endDate.toLocaleString() : "No definida"}`
        );
        console.log(
          `   Creada: ${membresia.createdAt ? membresia.createdAt.toLocaleString() : "No definida"}`
        );

        if (membresia.status === "active") {
          console.log("\n✅ La membresía está ACTIVA");
        } else {
          console.log(`\n⚠️  La membresía está en estado: ${membresia.status}`);
        }
      }
    } else {
      console.log("⚠️  El usuario NO tiene membresía asignada");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Desconectado de MongoDB");
    process.exit(0);
  }
}

verificarMembresia();

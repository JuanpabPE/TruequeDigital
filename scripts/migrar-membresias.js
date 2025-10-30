import mongoose from "mongoose";
import dotenv from "dotenv";
import Membership from "../src/models/membership.model.js";

dotenv.config();

const migrateMemberships = async () => {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Obtener todas las membresías que no tienen exchangesAllowed
    const membershipsToUpdate = await Membership.find({
      exchangesAllowed: { $exists: false },
    });

    console.log(
      `📊 Encontradas ${membershipsToUpdate.length} membresías para actualizar`
    );

    if (membershipsToUpdate.length === 0) {
      console.log("✨ No hay membresías para actualizar");
      process.exit(0);
    }

    // Definir intercambios según plan
    const exchangesByPlan = {
      basic: 3,
      standard: 12,
      premium: 30,
    };

    let updated = 0;
    let errors = 0;

    for (const membership of membershipsToUpdate) {
      try {
        const exchangesAllowed = exchangesByPlan[membership.plan] || 3;

        membership.exchangesAllowed = exchangesAllowed;
        membership.exchangesUsed = 0; // Resetear a 0 para dar el beneficio completo

        await membership.save();
        updated++;

        console.log(
          `✅ Actualizada membresía ${membership._id} - Plan: ${membership.plan} - Intercambios: ${exchangesAllowed}`
        );
      } catch (error) {
        errors++;
        console.error(
          `❌ Error actualizando membresía ${membership._id}:`,
          error.message
        );
      }
    }

    console.log("\n📈 Resumen de la migración:");
    console.log(`   ✅ Actualizadas: ${updated}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📊 Total procesadas: ${membershipsToUpdate.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    process.exit(1);
  }
};

// Ejecutar migración
migrateMemberships();

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.model.js";

dotenv.config();

const makeUserAdmin = async (email) => {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    if (!email) {
      console.error("❌ Error: Debes proporcionar un email como argumento");
      console.log("\nUso: node scripts/make-admin.js usuario@ejemplo.com");
      process.exit(1);
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: email });

    if (!user) {
      console.error(`❌ Usuario con email "${email}" no encontrado`);
      process.exit(1);
    }

    // Verificar si ya es admin
    if (user.isAdmin) {
      console.log(
        `ℹ️  El usuario ${user.username} (${email}) ya es administrador`
      );
      process.exit(0);
    }

    // Hacer admin
    user.isAdmin = true;
    await user.save();

    console.log(
      `✅ Usuario ${user.username} (${email}) ahora es ADMINISTRADOR`
    );
    console.log("\n📋 Información del usuario:");
    console.log(`   ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Admin: ${user.isAdmin}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Obtener email del argumento de línea de comandos
const email = process.argv[2];
makeUserAdmin(email);

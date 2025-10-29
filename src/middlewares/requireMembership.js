import Membership from "../models/membership.model.js";
import User from "../models/user.model.js";

export const requireActiveMembership = async (req, res, next) => {
  try {
    console.log("🔍 Checking membership for user:", req.user?.id);

    if (!req.user || !req.user.id) {
      console.error("❌ No user in request");
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    // Verificar si el usuario tiene una membresía activa
    const user = await User.findById(req.user.id).populate("activeMembership");

    if (!user) {
      console.error("❌ User not found:", req.user.id);
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    console.log("👤 User found:", user.username, "Membership:", user.activeMembership?.status);

    if (!user.activeMembership) {
      console.log("❌ No active membership");
      return res.status(403).json({
        message: "Necesitas una membresía activa para realizar esta acción",
        requiresMembership: true,
      });
    }

    // Verificar si la membresía no está expirada
    const membership = user.activeMembership;

    if (!membership.isActive()) {
      console.log("❌ Membership expired");
      // Actualizar estado
      membership.status = "expired";
      await membership.save();

      user.activeMembership = null;
      await user.save();

      return res.status(403).json({
        message: "Tu membresía ha expirado. Renueva para continuar",
        requiresMembership: true,
        expired: true,
      });
    }

    console.log("✅ Membership valid");
    // Adjuntar membresía a la request
    req.membership = membership;
    next();
  } catch (error) {
    console.error("❌ Error in requireActiveMembership:", error);
    res.status(500).json({ message: error.message });
  }
};

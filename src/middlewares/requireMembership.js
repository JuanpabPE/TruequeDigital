import Membership from "../models/membership.model.js";
import User from "../models/user.model.js";

export const requireActiveMembership = async (req, res, next) => {
  try {
    console.log("DEBUG - req.user:", JSON.stringify(req.user));
    console.log("DEBUG - isAdmin:", req.user?.isAdmin, "Type:", typeof req.user?.isAdmin);

    // ADMIN BYPASS: Los administradores no necesitan membresa
    if (req.user && req.user.isAdmin === true) {
      console.log("ADMIN BYPASS:", req.user.username);
      return next();
    }

    console.log("Checking membership for user:", req.user?.id);

    if (!req.user || !req.user.id) {
      console.error("No user in request");
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const user = await User.findById(req.user.id).populate("activeMembership");

    if (!user) {
      console.error("User not found:", req.user.id);
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    console.log("User found:", user.username, "Membership:", user.activeMembership?.status);

    if (!user.activeMembership) {
      console.log("No active membership for user:", user.username);
      return res.status(403).json({
        message: "Necesitas una membresía activa para realizar esta acción",
        requiresMembership: true,
      });
    }

    const membership = user.activeMembership;

    if (!membership.isActive()) {
      console.log("Membership expired");
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

    console.log("Membership valid");
    req.membership = membership;
    next();
  } catch (error) {
    console.error("Error in requireActiveMembership:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

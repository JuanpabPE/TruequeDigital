import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import User from "../models/user.model.js";
import Membership from "../models/membership.model.js";

const router = Router();

// Endpoint temporal de debug para verificar estado de membresía
router.get("/debug/my-membership", authRequired, async (req, res) => {
  try {
    console.log("🔍 DEBUG: Checking membership for user:", req.user.id);

    const user = await User.findById(req.user.id).populate("activeMembership");
    
    if (!user) {
      return res.json({
        error: "User not found",
        userId: req.user.id,
      });
    }

    // Buscar todas las membresías del usuario
    const allMemberships = await Membership.find({ user: user._id });

    res.json({
      userId: user._id,
      username: user.username,
      hasActiveMembershipLinked: !!user.activeMembership,
      activeMembership: user.activeMembership,
      allMemberships: allMemberships.map((m) => ({
        _id: m._id,
        plan: m.plan,
        status: m.status,
        startDate: m.startDate,
        endDate: m.endDate,
        isActive: m.isActive(),
      })),
    });
  } catch (error) {
    console.error("❌ DEBUG ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

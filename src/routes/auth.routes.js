import { Router } from "express";
import {
  login,
  register,
  logout,
  profile,
  verifyToken,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);

router.get("/verify", verifyToken);

router.get("/profile", authRequired, profile);

// Debug endpoint - temporal
router.get("/debug/me", authRequired, async (req, res) => {
  try {
    const User = (await import("../models/user.model.js")).default;
    const Membership = (await import("../models/membership.model.js")).default;
    
    const user = await User.findById(req.user.id)
      .populate("activeMembership")
      .select("-password");
    
    const allMemberships = await Membership.find({ user: req.user.id });
    
    res.json({
      user,
      allMemberships,
      hasActiveMembership: !!user.activeMembership,
      activeMembershipDetails: user.activeMembership,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

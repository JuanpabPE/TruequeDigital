import Membership from "../models/membership.model.js";
import User from "../models/user.model.js";

// Obtener planes disponibles
export const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: "basic",
        name: "Plan Básico",
        price: 5,
        duration: "1 mes",
        features: [
          "Intercambios ilimitados",
          "Matches inteligentes semanales",
          "Verificación de identidad",
          "Soporte 24/7 por WhatsApp",
          "Acceso a eventos presenciales",
        ],
      },
      {
        id: "standard",
        name: "Plan Standard",
        price: 15,
        duration: "1 mes",
        features: [
          "Todo lo del Plan Básico",
          "Prioridad en matches",
          "Destacar 3 publicaciones",
          "Acceso anticipado a eventos",
          "Badge de usuario premium",
        ],
      },
      {
        id: "premium",
        name: "Plan Premium",
        price: 30,
        duration: "1 mes",
        features: [
          "Todo lo del Plan Standard",
          "Matches ilimitados prioritarios",
          "Destacar todas las publicaciones",
          "Soporte prioritario VIP",
          "Mentoría personalizada mensual",
        ],
      },
    ];

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nueva membresía
export const createMembership = async (req, res) => {
  try {
    const { plan, paymentMethod, paymentProof } = req.body;

    // Definir precios según plan
    const prices = {
      basic: 5,
      standard: 15,
      premium: 30,
    };

    const price = prices[plan];
    if (!price) {
      return res.status(400).json({ message: "Plan inválido" });
    }

    // Calcular fecha de fin (1 mes después)
    const startDate = new Date();
    const endDate = Membership.calculateEndDate(plan, startDate);

    // Crear membresía
    const membership = new Membership({
      user: req.user.id,
      plan,
      price,
      startDate,
      endDate,
      status: "active",
      paymentMethod: paymentMethod || "whatsapp",
      paymentProof: paymentProof || "",
    });

    const savedMembership = await membership.save();

    // Actualizar usuario con la membresía activa
    await User.findByIdAndUpdate(req.user.id, {
      activeMembership: savedMembership._id,
    });

    res.status(201).json(savedMembership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener membresía activa del usuario
export const getActiveMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({
      user: req.user.id,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!membership) {
      // Devolver 200 con null en lugar de 404
      return res.json(null);
    }

    // Verificar si está vencida
    if (!membership.isActive()) {
      membership.status = "expired";
      await membership.save();

      // Remover membresía activa del usuario
      await User.findByIdAndUpdate(req.user.id, {
        activeMembership: null,
      });

      // Devolver 200 con null en lugar de 404
      return res.json(null);
    }

    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener historial de membresías
export const getMembershipHistory = async (req, res) => {
  try {
    const memberships = await Membership.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancelar membresía
export const cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({
      user: req.user.id,
      status: "active",
    });

    if (!membership) {
      return res
        .status(404)
        .json({ message: "No tienes una membresía activa" });
    }

    membership.status = "cancelled";
    membership.autoRenew = false;
    await membership.save();

    // Remover membresía activa del usuario
    await User.findByIdAndUpdate(req.user.id, {
      activeMembership: null,
    });

    res.json({ message: "Membresía cancelada exitosamente", membership });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Renovar membresía
export const renewMembership = async (req, res) => {
  try {
    const { paymentMethod, paymentProof } = req.body;

    // Obtener membresía anterior
    const oldMembership = await Membership.findOne({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    if (!oldMembership) {
      return res
        .status(404)
        .json({ message: "No tienes historial de membresías" });
    }

    // Crear nueva membresía con el mismo plan
    const startDate = new Date();
    const endDate = Membership.calculateEndDate(oldMembership.plan, startDate);

    const prices = {
      basic: 5,
      standard: 15,
      premium: 30,
    };

    const newMembership = new Membership({
      user: req.user.id,
      plan: oldMembership.plan,
      price: prices[oldMembership.plan],
      startDate,
      endDate,
      status: "active",
      paymentMethod: paymentMethod || oldMembership.paymentMethod,
      paymentProof: paymentProof || "",
    });

    const savedMembership = await newMembership.save();

    // Actualizar usuario
    await User.findByIdAndUpdate(req.user.id, {
      activeMembership: savedMembership._id,
    });

    res.status(201).json(savedMembership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AUTO-APROBAR MEMBRESÍA (Solo para desarrollo/testing)
export const autoApproveMembership = async (req, res) => {
  try {
    console.log("🔧 AUTO-APPROVE - User ID:", req.user.id);

    // Buscar la membresía pendiente más reciente del usuario
    const pendingMembership = await Membership.findOne({
      user: req.user.id,
      status: "pending",
    }).sort({ createdAt: -1 });

    if (!pendingMembership) {
      return res.json({
        message: "No tienes membresías pendientes",
        hasPending: false,
      });
    }

    console.log("✅ Found pending membership:", pendingMembership._id);

    // Aprobar automáticamente
    pendingMembership.status = "active";
    const now = new Date();
    pendingMembership.startDate = now;

    // Calcular fecha de fin (30 días)
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);
    pendingMembership.endDate = endDate;

    await pendingMembership.save();

    // Actualizar usuario
    await User.findByIdAndUpdate(req.user.id, {
      activeMembership: pendingMembership._id,
    });

    console.log("🎉 Membership auto-approved!");

    res.json({
      message: "Membresía aprobada automáticamente",
      membership: pendingMembership,
      approved: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

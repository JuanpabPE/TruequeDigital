import Membership from "../models/membership.model.js";
import User from "../models/user.model.js";
import cloudinary from "../libs/cloudinary.js";
import { Readable } from "stream";

// Obtener planes disponibles
export const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: "basic",
        name: "Plan Básico",
        price: 5,
        duration: "1 mes",
        exchanges: 3,
        features: [
          "3 intercambios al mes",
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
        exchanges: 12,
        features: [
          "12 intercambios al mes",
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
        exchanges: 30,
        features: [
          "30 intercambios al mes",
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

    // Definir precios e intercambios según plan
    const planDetails = {
      basic: { price: 5, exchanges: 3 },
      standard: { price: 15, exchanges: 12 },
      premium: { price: 30, exchanges: 30 },
    };

    const details = planDetails[plan];
    if (!details) {
      return res.status(400).json({ message: "Plan inválido" });
    }

    // Calcular fecha de fin (1 mes después)
    const startDate = new Date();
    const endDate = Membership.calculateEndDate(plan, startDate);

    // Crear membresía
    const membership = new Membership({
      user: req.user.id,
      plan,
      price: details.price,
      exchangesAllowed: details.exchanges,
      exchangesUsed: 0,
      startDate,
      endDate,
      status: "pending", // Pendiente hasta que se suba el comprobante
      paymentMethod: paymentMethod || "yape",
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
    // Buscar membresía activa primero
    let membership = await Membership.findOne({
      user: req.user.id,
      status: "active",
    }).sort({ createdAt: -1 });

    // Si no hay activa, buscar pendiente
    if (!membership) {
      membership = await Membership.findOne({
        user: req.user.id,
        status: "pending",
      }).sort({ createdAt: -1 });
    }

    if (!membership) {
      // Devolver 200 con null en lugar de 404
      return res.json(null);
    }

    // Verificar si está vencida (solo para activas)
    if (membership.status === "active" && !membership.isActive()) {
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

// Función helper para convertir buffer a stream
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

// Subir comprobante de pago
export const uploadPaymentProof = async (req, res) => {
  try {
    const { membershipId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ninguna imagen" });
    }

    if (!membershipId) {
      return res.status(400).json({ message: "membershipId es requerido" });
    }

    // Buscar la membresía
    const membership = await Membership.findOne({
      _id: membershipId,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }

    // Subir a Cloudinary usando stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "trueque-digital/payment-proofs",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      bufferToStream(req.file.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Actualizar membresía con el comprobante
    membership.paymentProof = result.secure_url;
    membership.status = "pending"; // Mantener en pending para revisión manual
    await membership.save();

    // NO actualizar usuario con la membresía activa todavía
    // Esto se hará cuando un admin apruebe el pago

    res.json({
      message: "Comprobante subido exitosamente. Tu pago será revisado pronto.",
      url: result.secure_url,
      membership,
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    res.status(500).json({
      message: "Error al subir el comprobante",
      error: error.message,
    });
  }
};

// OBTENER TODAS LAS MEMBRESÍAS PENDIENTES (Admin)
export const getPendingMemberships = async (req, res) => {
  try {
    const pendingMemberships = await Membership.find({
      status: "pending",
      paymentProof: { $ne: "" }, // Solo las que tienen comprobante
    })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(pendingMemberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APROBAR MEMBRESÍA (Admin)
export const approveMembership = async (req, res) => {
  try {
    const { membershipId } = req.params;

    const membership = await Membership.findById(membershipId);

    if (!membership) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }

    if (membership.status !== "pending") {
      return res.status(400).json({
        message: "Solo se pueden aprobar membresías pendientes",
      });
    }

    // Aprobar la membresía
    membership.status = "active";
    const now = new Date();
    membership.startDate = now;

    // Calcular fecha de fin (30 días)
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);
    membership.endDate = endDate;

    await membership.save();

    // Actualizar usuario con la membresía activa
    await User.findByIdAndUpdate(membership.user, {
      activeMembership: membership._id,
    });

    console.log(
      `✅ Membresía ${membershipId} aprobada para usuario ${membership.user}`
    );

    res.json({
      message: "Membresía aprobada exitosamente",
      membership,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RECHAZAR MEMBRESÍA (Admin)
export const rejectMembership = async (req, res) => {
  try {
    const { membershipId } = req.params;
    const { reason } = req.body;

    const membership = await Membership.findById(membershipId);

    if (!membership) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }

    if (membership.status !== "pending") {
      return res.status(400).json({
        message: "Solo se pueden rechazar membresías pendientes",
      });
    }

    // Rechazar la membresía
    membership.status = "cancelled";
    membership.rejectionReason = reason || "Comprobante inválido";
    await membership.save();

    console.log(
      `❌ Membresía ${membershipId} rechazada. Razón: ${reason || "No especificada"}`
    );

    res.json({
      message: "Membresía rechazada",
      membership,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

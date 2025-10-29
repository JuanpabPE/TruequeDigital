import Exchange from "../models/exchange.model.js";
import User from "../models/user.model.js";

// Crear nuevo trueque
export const createExchange = async (req, res) => {
  try {
    console.log("📝 ===== CREATE EXCHANGE REQUEST =====");
    console.log("👤 User ID:", req.user?.id);
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
    
    const {
      title,
      description,
      offeringCategory,
      offeringCondition,
      offeringEstimatedValue,
      seekingCategory,
      seekingDescription,
      location,
      isVirtual,
      images,
    } = req.body;

    console.log("✨ Creating exchange for user:", req.user.id);

    // El middleware requireActiveMembership ya verificó la membresía activa
    console.log("📋 Creating exchange object...");
    const newExchange = new Exchange({
      user: req.user.id,
      title,
      description,
      offering: {
        category: offeringCategory,
        condition: offeringCondition,
        estimatedValue: offeringEstimatedValue,
      },
      seeking: {
        category: seekingCategory,
        description: seekingDescription,
      },
      location: isVirtual ? "Virtual" : location,
      isVirtual,
      images: images || [],
      status: "disponible", // Estado inicial en español
    });

    console.log("💾 Saving exchange...");
    const savedExchange = await newExchange.save();
    console.log(
      "✅ Exchange created:",
      savedExchange._id,
      "by user:",
      req.user.id
    );

    console.log("🔍 Populating exchange...");
    const populatedExchange = await Exchange.findById(
      savedExchange._id
    ).populate("user", "username email university averageRating");

    console.log("✅ Exchange populated successfully");
    res.status(201).json(populatedExchange);
  } catch (error) {
    console.error("❌ ERROR creating exchange:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    
    // Manejar errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));
      console.error("❌ Validation errors:", validationErrors);
      return res.status(400).json({
        message: "Error de validación",
        errors: validationErrors,
      });
    }
    
    res
      .status(500)
      .json({ message: "Error al crear el trueque", error: error.message });
  }
};

// Obtener todos los trueques disponibles (con filtros opcionales)
export const getExchanges = async (req, res) => {
  try {
    const {
      category,
      condition,
      isVirtual,
      search,
      minValue,
      maxValue,
      location,
    } = req.query;

    // Mostrar todos los exchanges disponibles (incluyendo propios)
    let query = {
      $or: [
        { status: "disponible" },
        { status: "available" }, // Compatibilidad con estados antiguos
      ],
    };

    // Filtros
    if (category) {
      query.$or = [
        { "offering.category": category },
        { "seeking.category": category },
      ];
    }

    if (condition) {
      query["offering.condition"] = condition;
    }

    if (isVirtual !== undefined) {
      query.isVirtual = isVirtual === "true";
    }

    if (location && location !== "all") {
      query.location = new RegExp(location, "i");
    }

    if (minValue || maxValue) {
      query["offering.estimatedValue"] = {};
      if (minValue) query["offering.estimatedValue"].$gte = Number(minValue);
      if (maxValue) query["offering.estimatedValue"].$lte = Number(maxValue);
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { "offering.category": new RegExp(search, "i") },
        { "seeking.category": new RegExp(search, "i") },
      ];
    }

    console.log("🔍 getExchanges - Query:", JSON.stringify(query, null, 2));
    console.log("👤 Current user ID:", req.user.id);

    const exchanges = await Exchange.find(query)
      .populate("user", "username email university averageRating profileImage")
      .sort({ createdAt: -1 });

    console.log(
      `📦 Found ${exchanges.length} exchanges (including user's own)`
    );

    res.json(exchanges);
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    res
      .status(500)
      .json({ message: "Error al obtener trueques", error: error.message });
  }
};

// Obtener un trueque por ID
export const getExchangeById = async (req, res) => {
  try {
    const { id } = req.params;

    const exchange = await Exchange.findById(id).populate(
      "user",
      "username email university career averageRating profileImage phone"
    );

    if (!exchange) {
      return res.status(404).json({ message: "Trueque no encontrado" });
    }

    res.json(exchange);
  } catch (error) {
    console.error("Error fetching exchange:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el trueque", error: error.message });
  }
};

// Obtener mis trueques
export const getMyExchanges = async (req, res) => {
  try {
    console.log("🔍 getMyExchanges - User ID:", req.user.id);

    const exchanges = await Exchange.find({ user: req.user.id })
      .populate("user", "username email university averageRating")
      .sort({ createdAt: -1 });

    console.log(
      `📦 Found ${exchanges.length} exchanges for user ${req.user.id}`
    );

    res.json(exchanges);
  } catch (error) {
    console.error("Error fetching my exchanges:", error);
    res
      .status(500)
      .json({ message: "Error al obtener tus trueques", error: error.message });
  }
};

// Actualizar trueque
export const updateExchange = async (req, res) => {
  try {
    const { id } = req.params;

    const exchange = await Exchange.findById(id);

    if (!exchange) {
      return res.status(404).json({ message: "Trueque no encontrado" });
    }

    // Verificar que el usuario sea el dueño
    if (exchange.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este trueque" });
    }

    const {
      title,
      description,
      offeringCategory,
      offeringCondition,
      offeringEstimatedValue,
      seekingCategory,
      seekingDescription,
      location,
      isVirtual,
      images,
      status,
    } = req.body;

    // Actualizar campos
    if (title) exchange.title = title;
    if (description) exchange.description = description;
    if (offeringCategory) exchange.offering.category = offeringCategory;
    if (offeringCondition) exchange.offering.condition = offeringCondition;
    if (offeringEstimatedValue)
      exchange.offering.estimatedValue = offeringEstimatedValue;
    if (seekingCategory) exchange.seeking.category = seekingCategory;
    if (seekingDescription) exchange.seeking.description = seekingDescription;
    if (location) exchange.location = location;
    if (isVirtual !== undefined) exchange.isVirtual = isVirtual;
    if (images) exchange.images = images;
    if (status) exchange.status = status;

    const updatedExchange = await exchange.save();
    const populatedExchange = await Exchange.findById(
      updatedExchange._id
    ).populate("user", "username email university averageRating");

    res.json(populatedExchange);
  } catch (error) {
    console.error("Error updating exchange:", error);
    res.status(500).json({
      message: "Error al actualizar el trueque",
      error: error.message,
    });
  }
};

// Eliminar trueque
export const deleteExchange = async (req, res) => {
  try {
    const { id } = req.params;

    const exchange = await Exchange.findById(id);

    if (!exchange) {
      return res.status(404).json({ message: "Trueque no encontrado" });
    }

    // Verificar que el usuario sea el dueño
    if (exchange.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este trueque" });
    }

    await Exchange.findByIdAndDelete(id);

    res.json({ message: "Trueque eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting exchange:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar el trueque", error: error.message });
  }
};

// Cambiar estado de un trueque (disponible, pausado, completado, cancelado)
export const updateExchangeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "available",
      "in-progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const exchange = await Exchange.findById(id);

    if (!exchange) {
      return res.status(404).json({ message: "Trueque no encontrado" });
    }

    // Verificar que el usuario sea el dueño
    if (exchange.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para cambiar el estado" });
    }

    exchange.status = status;
    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id).populate(
      "user",
      "username email university averageRating"
    );

    res.json(populatedExchange);
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el estado", error: error.message });
  }
};

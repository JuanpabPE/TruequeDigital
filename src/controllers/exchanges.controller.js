import Exchange from "../models/exchange.model.js";
import User from "../models/user.model.js";

// Crear nuevo trueque
export const createExchange = async (req, res) => {
  try {
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

    // El middleware requireActiveMembership ya verificó la membresía activa
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
      status: "available",
    });

    const savedExchange = await newExchange.save();
    const populatedExchange = await Exchange.findById(
      savedExchange._id
    ).populate("user", "username email university averageRating");

    res.status(201).json(populatedExchange);
  } catch (error) {
    console.error("Error creating exchange:", error);
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

    let query = { status: "available" };

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

    const exchanges = await Exchange.find(query)
      .populate("user", "username email university averageRating profileImage")
      .sort({ createdAt: -1 });

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
    const exchanges = await Exchange.find({ user: req.user.id })
      .populate("user", "username email university averageRating")
      .sort({ createdAt: -1 });

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
    res
      .status(500)
      .json({
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

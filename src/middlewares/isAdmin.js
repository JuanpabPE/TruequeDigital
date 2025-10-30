export const isAdmin = (req, res, next) => {
  try {
    // Verificar si el usuario autenticado es admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        message: "Acceso denegado. Se requieren privilegios de administrador.",
      });
    }

    // Si es admin, continuar
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

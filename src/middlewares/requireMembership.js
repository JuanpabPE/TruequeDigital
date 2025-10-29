import Membership from '../models/membership.model.js';
import User from '../models/user.model.js';

export const requireActiveMembership = async (req, res, next) => {
    try {
        // Verificar si el usuario tiene una membresía activa
        const user = await User.findById(req.user.id).populate('activeMembership');

        if (!user.activeMembership) {
            return res.status(403).json({
                message: 'Necesitas una membresía activa para realizar esta acción',
                requiresMembership: true
            });
        }

        // Verificar si la membresía no está expirada
        const membership = user.activeMembership;
        
        if (!membership.isActive()) {
            // Actualizar estado
            membership.status = 'expired';
            await membership.save();
            
            user.activeMembership = null;
            await user.save();

            return res.status(403).json({
                message: 'Tu membresía ha expirado. Renueva para continuar',
                requiresMembership: true,
                expired: true
            });
        }

        // Adjuntar membresía a la request
        req.membership = membership;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

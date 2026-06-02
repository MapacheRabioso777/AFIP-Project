import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y adjunta los datos del usuario a req.user
 */
export const verifyToken = async (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                ok: false,
                status: 401,
                message: 'No se proporcionó token de autenticación'
            });
        }

        // Extraer el token (remover "Bearer ")
        const token = authHeader.substring(7);

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const user = await userModel.findOne({
            where: { user_user: decoded.email }
        });

        if (!user) {
            return res.status(401).json({
                ok: false,
                status: 401,
                message: 'Usuario no encontrado'
            });
        }

        // Adjuntar datos del usuario al request para uso posterior
        req.user = {
            user_id: user.user_id,
            email: user.user_user
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                ok: false,
                status: 401,
                message: 'Token inválido'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                ok: false,
                status: 401,
                message: 'Token expirado'
            });
        }

        console.error('Error en middleware de autenticación:', error);
        return res.status(500).json({
            ok: false,
            status: 500,
            message: 'Error al verificar autenticación'
        });
    }
};

export default verifyToken;

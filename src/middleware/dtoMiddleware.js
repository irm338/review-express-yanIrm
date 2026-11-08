
const jwt = require('jsonwebtoken');
const { JWT_SECRETO } = require('../config/env');

const verificarAutenticacion = (req, res, next) => {
    // Obtenemos el token desde las cookies (requiere cookie-parser) o desde el header de autorización
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de autenticación.' });
    }

    jwt.verify(token, JWT_SECRETO, (error, usuarioDecodificado) => {
        if (error) {
            return res.status(403).json({ error: 'Token inválido o expirado.' });
        }
        
        // Guardamos los datos del usuario en la petición para usarlos en el controlador
        req.usuario = usuarioDecodificado;
        next();
    });
};

const verificarRolAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'administrador') {
        next();
    } else {
        res.status(403).json({ error: 'Acceso prohibido. Se requieren privilegios de administrador.' });
    }
};

module.exports = {
    verificarAutenticacion,
    verificarRolAdmin
};
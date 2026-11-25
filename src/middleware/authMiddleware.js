const passport = require('../config/passport');

// Valida el JWT extraído por Passport desde la cookie o la cabecera Bearer.
const verificarAutenticacion = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, usuario, informacion) => {
        if (error) {
            console.error('Error al validar la autenticación:', error);
            return res.status(500).json({ error: 'No fue posible validar la autenticación.' });
        }

        if (!usuario) {
            const mensaje = informacion?.name === 'TokenExpiredError'
                ? 'La sesión expiró. Inicie sesión nuevamente.'
                : 'Se requiere una sesión válida para acceder a este recurso.';
            return res.status(401).json({ error: mensaje });
        }

        // Conserva la propiedad en español utilizada por los controladores.
        req.usuario = usuario;
        req.user = usuario;
        return next();
    })(req, res, next);
};

// Restringe las operaciones administrativas al rol de administrador.
const verificarRolAdmin = (req, res, next) => {
    if (req.usuario?.rol !== 'administrador') {
        return res.status(403).json({ error: 'Acceso prohibido. Se requieren permisos de administrador.' });
    }

    return next();
};

// Impide consultar o modificar perfiles ajenos, excepto a los administradores.
const verificarAccesoUsuario = (req, res, next) => {
    const idSolicitado = req.params.usuarioId || req.params.id || req.body?.usuario_id;
    if (req.usuario?.rol === 'administrador' || String(req.usuario?.id) === String(idSolicitado)) {
        return next();
    }

    return res.status(403).json({ error: 'No tiene permiso para acceder a la cuenta solicitada.' });
};

module.exports = {
    verificarAutenticacion,
    verificarRolAdmin,
    verificarAccesoUsuario
};

const rateLimit = require('express-rate-limit');

// Limita las solicitudes por dirección IP para reducir abusos y fuerza bruta.
const limitarPeticiones = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Se realizaron demasiadas solicitudes desde esta dirección. Inténtelo de nuevo en 15 minutos.'
    }
});

module.exports = { limitarPeticiones };

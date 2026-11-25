// Ejecuta la validación del DTO asociado al cuerpo de la solicitud.
const validarDto = (esquemaValidacion) => (req, res, next) => {
    const resultado = esquemaValidacion.validate(req.body);

    if (resultado.error) {
        return res.status(400).json({
            error: 'Los datos enviados no son válidos.',
            detalle: resultado.error.details?.[0]?.message || resultado.error.message
        });
    }

    return next();
};

module.exports = { validarDto };

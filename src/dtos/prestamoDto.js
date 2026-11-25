// Valida que el préstamo incluya identificadores válidos y fechas coherentes.
const validarPrestamoDto = (req, res, next) => {
    const cuerpo = req.body && typeof req.body === 'object' ? req.body : {};
    const { usuario_id, libro_id, fecha_prestamo, fecha_tentativa_devolucion } = cuerpo;
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;
    const esFechaReal = (valor) => {
        if (typeof valor !== 'string' || !formatoFecha.test(valor)) {
            return false;
        }
        const fecha = new Date(`${valor}T00:00:00Z`);
        return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
    };

    if (!Number.isInteger(Number(usuario_id)) || Number(usuario_id) < 1
        || !Number.isInteger(Number(libro_id)) || Number(libro_id) < 1
        || !esFechaReal(fecha_prestamo) || !esFechaReal(fecha_tentativa_devolucion)) {
        return res.status(400).json({
            error: 'Indique usuario, libro y fechas válidas para registrar el préstamo.'
        });
    }

    if (fecha_tentativa_devolucion < fecha_prestamo) {
        return res.status(400).json({
            error: 'La fecha tentativa de devolución no puede ser anterior a la fecha del préstamo.'
        });
    }

    req.body.usuario_id = Number(usuario_id);
    req.body.libro_id = Number(libro_id);
    return next();
};

module.exports = { validarPrestamoDto };

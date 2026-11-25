// Verifica el formato del detalle y que sus subtotales coincidan con el total.
const validarVentaDto = (req, res, next) => {
    const cuerpo = req.body && typeof req.body === 'object' ? req.body : {};
    const { usuario_id, total, libros } = cuerpo;
    const usuarioValido = Number.isInteger(Number(usuario_id)) && Number(usuario_id) > 0;
    const totalNumerico = Number(total);
    const detalleValido = Array.isArray(libros) && libros.length > 0
        && libros.every((libro) => (
            Number.isInteger(Number(libro.libro_id))
            && Number(libro.libro_id) > 0
            && Number.isInteger(Number(libro.cantidad))
            && Number(libro.cantidad) > 0
            && Number.isFinite(Number(libro.subtotal))
            && Number(libro.subtotal) >= 0
        ));

    if (!usuarioValido || !Number.isFinite(totalNumerico) || totalNumerico < 0 || !detalleValido) {
        return res.status(400).json({
            error: 'Indique un usuario, un total y al menos un detalle de venta válido.'
        });
    }

    const sumaSubtotales = libros.reduce((suma, libro) => suma + Number(libro.subtotal), 0);
    if (Math.abs(sumaSubtotales - totalNumerico) > 0.01) {
        return res.status(400).json({
            error: 'El total de la venta debe coincidir con la suma de los subtotales.'
        });
    }

    req.body = {
        ...cuerpo,
        usuario_id: Number(usuario_id),
        total: Number(totalNumerico.toFixed(2)),
        libros: libros.map((libro) => ({
        libro_id: Number(libro.libro_id),
        cantidad: Number(libro.cantidad),
        subtotal: Number(Number(libro.subtotal).toFixed(2))
        }))
    };
    return next();
};

module.exports = { validarVentaDto };

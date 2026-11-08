
const validarLibroDto = (req, res, next) => {
    const { titulo, autor, stock, precio } = req.body;

    if (!titulo || !autor || stock === undefined || precio === undefined) {
        return res.status(400).json({ 
            error: 'Faltan datos obligatorios: título, autor, stock y precio son requeridos.' 
        });
    }

    if (typeof stock !== 'number' || typeof precio !== 'number') {
        return res.status(400).json({ 
            error: 'El stock y el precio deben ser valores numéricos.' 
        });
    }

    next();
};

module.exports = { validarLibroDto };
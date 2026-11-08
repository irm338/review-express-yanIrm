
const validarDto = (esquemaValidacion) => {
    return (req, res, next) => {
        const { error } = esquemaValidacion.validate(req.body); // O validación manual básica en español
        
        // Ejemplo de validación básica estructurada en español:
        if (error) {
            return res.status(400).json({ 
                error: 'Error de validación en los datos enviados', 
                detalle: error.details ? error.details[0].message : error.message 
            });
        }
        
        next();
    };
};

module.exports = { validarDto };
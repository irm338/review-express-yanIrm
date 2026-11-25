// Normaliza y valida los datos recibidos para crear o actualizar un libro.
class LibroDTO {
    constructor(datos = {}) {
        datos = datos && typeof datos === 'object' && !Array.isArray(datos) ? datos : {};
        this.titulo = typeof datos.titulo === 'string' ? datos.titulo.trim() : '';
        this.autor = typeof datos.autor === 'string' ? datos.autor.trim() : '';
        this.categoria = typeof datos.categoria === 'string' ? datos.categoria.trim() : '';
        this.stock = datos.stock === '' || datos.stock === null || datos.stock === undefined
            ? Number.NaN
            : Number(datos.stock);
        this.precio = datos.precio === '' || datos.precio === null || datos.precio === undefined
            ? Number.NaN
            : Number(datos.precio);
    }

    validar() {
        if (!this.titulo || !this.autor || Number.isNaN(this.stock) || Number.isNaN(this.precio)) {
            return 'Los campos título, autor, stock y precio son obligatorios.';
        }

        if (!Number.isInteger(this.stock)) {
            return 'El stock debe tener un formato válido: un número entero.';
        }

        if (this.stock < 0) {
            return 'El stock no puede ser negativo.';
        }

        if (!Number.isFinite(this.precio) || this.precio < 0) {
            return 'El precio debe ser un número válido mayor o igual a cero.';
        }

        return null;
    }

    toJSON() {
        return {
            titulo: this.titulo,
            autor: this.autor,
            categoria: this.categoria,
            stock: this.stock,
            precio: this.precio
        };
    }
}

// Valida y normaliza el DTO antes de enviar la solicitud al controlador.
const validarLibroDto = (req, res, next) => {
    const libro = new LibroDTO(req.body);
    const error = libro.validar();

    if (error) {
        return res.status(400).json({ error });
    }

    req.body = libro.toJSON();
    return next();
};

module.exports = LibroDTO;
module.exports.validarLibroDto = validarLibroDto;

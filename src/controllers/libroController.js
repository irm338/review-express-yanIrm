const db = require('../config/db');

// Ejecuta consultas del catálogo y devuelve respuestas JSON en español.
exports.crearLibro = async (req, res) => {
    const { titulo, autor, categoria, stock, precio } = req.body;

    try {
        const [resultado] = await db.promise().execute(
            'INSERT INTO libros (titulo, autor, categoria, stock, precio) VALUES (?, ?, ?, ?, ?)',
            [titulo, autor, categoria || null, stock, precio]
        );
        return res.status(201).json({ mensaje: 'Libro creado correctamente.', id: resultado.insertId });
    } catch (error) {
        console.error('Error al crear el libro:', error);
        return res.status(500).json({ error: 'No fue posible crear el libro.' });
    }
};

exports.listarLibros = async (req, res) => {
    try {
        const [libros] = await db.promise().execute(
            'SELECT id, titulo, autor, categoria, stock, precio FROM libros ORDER BY id'
        );
        return res.json(libros);
    } catch (error) {
        console.error('Error al listar los libros:', error);
        return res.status(500).json({ error: 'No fue posible obtener los libros.' });
    }
};

exports.buscarLibro = async (req, res) => {
    const titulo = typeof req.query.titulo === 'string' ? req.query.titulo.trim() : '';
    if (!titulo) {
        return res.status(400).json({ error: 'Debe indicar el título que desea buscar.' });
    }

    try {
        const [libros] = await db.promise().execute(
            'SELECT id, titulo, autor, categoria, stock, precio FROM libros WHERE titulo LIKE ? ORDER BY titulo',
            [`%${titulo}%`]
        );
        return res.json(libros);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        return res.status(500).json({ error: 'No fue posible buscar los libros.' });
    }
};

exports.actualizarLibro = async (req, res) => {
    const { id } = req.params;
    const { titulo, autor, categoria, stock, precio } = req.body;

    try {
        const [resultado] = await db.promise().execute(
            'UPDATE libros SET titulo = ?, autor = ?, categoria = ?, stock = ?, precio = ? WHERE id = ?',
            [titulo, autor, categoria || null, stock, precio, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró el libro solicitado.' });
        }
        return res.json({ mensaje: 'Libro actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        return res.status(500).json({ error: 'No fue posible actualizar el libro.' });
    }
};

exports.eliminarLibro = async (req, res) => {
    try {
        const [resultado] = await db.promise().execute(
            'DELETE FROM libros WHERE id = ?',
            [req.params.id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró el libro solicitado.' });
        }
        return res.json({ mensaje: 'Libro eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        return res.status(500).json({ error: 'No fue posible eliminar el libro.' });
    }
};

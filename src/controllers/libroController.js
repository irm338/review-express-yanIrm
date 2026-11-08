
const db = require('../config/db');

exports.crearLibro = (req, res) => {
    const { titulo, autor, categoria, stock, precio } = req.body;
    const consulta = 'INSERT INTO libros (titulo, autor, categoria, stock, precio) VALUES (?, ?, ?, ?, ?)';
    
    db.query(consulta, [titulo, autor, categoria, stock, precio], (error, resultado) => {
        if (error) return res.status(500).json({ error: 'Error al crear el libro' });
        res.status(201).json({ mensaje: 'Libro creado con éxito', id: resultado.insertId });
    });
};

exports.listarLibros = (req, res) => {
    db.query('SELECT * FROM libros', (error, resultados) => {
        if (error) return res.status(500).json({ error: 'Error al listar los libros' });
        res.json(resultados);
    });
};

exports.actualizarLibro = (req, res) => {
    const { id } = req.params;
    const { titulo, autor, categoria, stock, precio } = req.body;
    const consulta = 'UPDATE libros SET titulo = ?, autor = ?, categoria = ?, stock = ?, precio = ? WHERE id = ?';
    
    db.query(consulta, [titulo, autor, categoria, stock, precio, id], (error) => {
        if (error) return res.status(500).json({ error: 'Error al actualizar el libro' });
        res.json({ mensaje: 'Libro actualizado correctamente' });
    });
};

exports.eliminarLibro = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM libros WHERE id = ?', [id], (error) => {
        if (error) return res.status(500).json({ error: 'Error al eliminar el libro' });
        res.json({ mensaje: 'Libro eliminado correctamente' });
    });
};
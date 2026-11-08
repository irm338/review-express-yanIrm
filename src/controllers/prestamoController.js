
const db = require('../config/db');

exports.prestarLibro = (req, res) => {
    const { usuario_id, libro_id, fecha_prestamo, fecha_tentativa_devolucion } = req.body;
    const consulta = 'INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_tentativa_devolucion, estado) VALUES (?, ?, ?, ?, ?)';
    
    db.query(consulta, [usuario_id, libro_id, fecha_prestamo, fecha_tentativa_devolucion, 'Prestado'], (error, resultado) => {
        if (error) return res.status(500).json({ error: 'Error al registrar el préstamo' });
        res.status(201).json({ mensaje: 'Préstamo registrado con éxito', id: resultado.insertId });
    });
};

exports.verHistorialPrestamos = (req, res) => {
    const { usuarioId } = req.params;
    const consulta = `
        SELECT p.id, l.titulo, p.fecha_prestamo, p.fecha_tentativa_devolucion, p.fecha_devolucion, p.estado 
        FROM prestamos p 
        JOIN libros l ON p.libro_id = l.id 
        WHERE p.usuario_id = ?
    `;
    db.query(consulta, [usuarioId], (error, resultados) => {
        if (error) return res.status(500).json({ error: 'Error al obtener el historial de préstamos' });
        res.json(resultados);
    });
};
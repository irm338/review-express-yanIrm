const db = require('../config/db');

// Registra préstamos con consultas parametrizadas para evitar inyección SQL.
exports.prestarLibro = async (req, res) => {
    const { usuario_id, libro_id, fecha_prestamo, fecha_tentativa_devolucion } = req.body;

    try {
        const [resultado] = await db.promise().execute(
            'INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_tentativa_devolucion, estado) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, libro_id, fecha_prestamo, fecha_tentativa_devolucion, 'Pendiente']
        );
        return res.status(201).json({ mensaje: 'Préstamo registrado correctamente.', id: resultado.insertId });
    } catch (error) {
        console.error('Error al registrar el préstamo:', error);
        return res.status(500).json({ error: 'No fue posible registrar el préstamo.' });
    }
};

exports.verHistorialPrestamos = async (req, res) => {
    const consulta = `
        SELECT p.id, l.titulo, p.fecha_prestamo, p.fecha_tentativa_devolucion,
               p.fecha_devolucion, p.estado
        FROM prestamos p
        INNER JOIN libros l ON p.libro_id = l.id
        WHERE p.usuario_id = ?
        ORDER BY p.fecha_prestamo DESC
    `;

    try {
        const [prestamos] = await db.promise().execute(consulta, [req.params.usuarioId]);
        return res.json(prestamos);
    } catch (error) {
        console.error('Error al consultar el historial de préstamos:', error);
        return res.status(500).json({ error: 'No fue posible obtener el historial de préstamos.' });
    }
};

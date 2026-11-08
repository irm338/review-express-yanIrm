
const db = require('../config/db');

exports.realizarVenta = (req, res) => {
    const { usuario_id, total, libros } = req.body; // libros = [{ libro_id, cantidad, subtotal }]
    
    const consultaVenta = 'INSERT INTO ventas (usuario_id, total) VALUES (?, ?)';
    db.query(consultaVenta, [usuario_id, total], (error, resultadoVenta) => {
        if (error) return res.status(500).json({ error: 'Error al registrar la venta' });
        
        const ventaId = resultadoVenta.insertId;

        libros.forEach(item => {
            const consultaDetalle = 'INSERT INTO detalle_ventas (venta_id, libro_id, cantidad, subtotal) VALUES (?, ?, ?, ?)';
            db.query(consultaDetalle, [ventaId, item.libro_id, item.cantidad, item.subtotal], (err) => {
                if (err) console.error('Error al registrar detalle de venta:', err);
            });
        });

        res.status(201).json({ mensaje: 'Venta realizada con éxito', venta_id: ventaId });
    });
};

exports.verHistorialCompras = (req, res) => {
    const { usuarioId } = req.params;
    const consulta = `
        SELECT v.id AS venta_id, v.fecha_venta, v.total, l.titulo, dv.cantidad, dv.subtotal
        FROM ventas v
        JOIN detalle_ventas dv ON v.id = dv.venta_id
        JOIN libros l ON dv.libro_id = l.id
        WHERE v.usuario_id = ?
    `;
    db.query(consulta, [usuarioId], (error, resultados) => {
        if (error) return res.status(500).json({ error: 'Error al obtener el historial de compras' });
        res.json(resultados);
    });
};
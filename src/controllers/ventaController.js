const db = require('../config/db');

// Registra la venta y su detalle en una sola transacción.
exports.realizarVenta = async (req, res) => {
    const { usuario_id, total, libros } = req.body;
    let conexion;
    let transaccionIniciada = false;

    try {
        conexion = await db.promise().getConnection();
        await conexion.beginTransaction();
        transaccionIniciada = true;
        const [venta] = await conexion.execute(
            'INSERT INTO ventas (usuario_id, total) VALUES (?, ?)',
            [usuario_id, total]
        );

        for (const libro of libros) {
            await conexion.execute(
                'INSERT INTO detalle_ventas (venta_id, libro_id, cantidad, subtotal) VALUES (?, ?, ?, ?)',
                [venta.insertId, libro.libro_id, libro.cantidad, libro.subtotal]
            );
        }

        await conexion.commit();
        transaccionIniciada = false;
        return res.status(201).json({
            mensaje: 'Venta realizada correctamente.',
            venta_id: venta.insertId
        });
    } catch (error) {
        if (conexion && transaccionIniciada) {
            await conexion.rollback();
        }
        console.error('Error al registrar la venta:', error);
        return res.status(500).json({ error: 'No fue posible registrar la venta.' });
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
};

exports.verHistorialCompras = async (req, res) => {
    const consulta = `
        SELECT v.id AS venta_id, v.fecha_venta, v.total, l.titulo,
               dv.cantidad, dv.subtotal
        FROM ventas v
        INNER JOIN detalle_ventas dv ON v.id = dv.venta_id
        INNER JOIN libros l ON dv.libro_id = l.id
        WHERE v.usuario_id = ?
        ORDER BY v.fecha_venta DESC
    `;

    try {
        const [ventas] = await db.promise().execute(consulta, [req.params.usuarioId]);
        return res.json(ventas);
    } catch (error) {
        console.error('Error al consultar el historial de compras:', error);
        return res.status(500).json({ error: 'No fue posible obtener el historial de compras.' });
    }
};


const Modelo = require('../models/bibliotecaModelo');

const bibliotecaControlador = {
    // --- GESTIÓN DE LIBROS (ADMIN) ---
    crearLibro: (req, res) => {
        Modelo.crearLibro(req.body, (error, resultado) => {
            if (error) return res.status(500).json({ error: 'Error al registrar el libro' });
            res.status(201).json({ mensaje: 'Libro creado con éxito', id: resultado.insertId });
        });
    },

    listarLibros: (req, res) => {
        Modelo.listarLibros((error, resultados) => {
            if (error) return res.status(500).json({ error: 'Error al obtener los libros' });
            res.json(resultados);
        });
    },

    buscarLibro: (req, res) => {
        const { titulo } = req.query;
        Modelo.buscarLibroPorTitulo(titulo, (error, resultados) => {
            if (error) return res.status(500).json({ error: 'Error al buscar el libro' });
            res.json(resultados);
        });
    },

    actualizarLibro: (req, res) => {
        const { id } = req.params;
        Modelo.actualizarLibro(id, req.body, (error, resultado) => {
            if (error) return res.status(500).json({ error: 'Error al actualizar el libro' });
            res.json({ mensaje: 'Libro actualizado correctamente' });
        });
    },

    eliminarLibro: (req, res) => {
        const { id } = req.params;
        Modelo.eliminarLibro(id, (error, resultado) => {
            if (error) return res.status(500).json({ error: 'Error al eliminar el libro' });
            res.json({ mensaje: 'Libro eliminado correctamente' });
        });
    },

    // --- PRESTAR LIBROS (ADMIN / USUARIO) ---
    prestarLibro: (req, res) => {
        Modelo.registrarPrestamo(req.body, (error, resultado) => {
            if (error) return res.status(500).json({ error: 'Error al registrar el préstamo' });
            res.status(201).json({ mensaje: 'Préstamo registrado exitosamente', id: resultado.insertId });
        });
    },

    verHistorialPrestamos: (req, res) => {
        const { usuarioId } = req.params;
        Modelo.obtenerHistorialPrestamos(usuarioId, (error, resultados) => {
            if (error) return res.status(500).json({ error: 'Error al obtener el historial de préstamos' });
            res.json(resultados);
        });
    },

    // --- VENTA DE LIBROS ---
    realizarVenta: (req, res) => {
        const { usuario_id, total, libros } = req.body; // libros es un array de { libro_id, cantidad, subtotal }
        
        Modelo.registrarVenta(usuario_id, total, (error, resultadoVenta) => {
            if (error) return res.status(500).json({ error: 'Error al registrar la venta' });
            
            const ventaId = resultadoVenta.insertId;

            // Registrar cada libro del detalle de venta
            libros.forEach(item => {
                Modelo.registrarDetalleVenta(ventaId, item.libro_id, item.cantidad, item.subtotal, (err) => {
                    if (err) console.error('Error al guardar detalle de venta:', err);
                });
            });

            res.status(201).json({ mensaje: 'Venta realizada con éxito', venta_id: ventaId });
        });
    },

    verHistorialCompras: (req, res) => {
        const { usuarioId } = req.params;
        Modelo.obtenerHistorialCompras(usuarioId, (error, resultados) => {
            if (error) return res.status(500).json({ error: 'Error al obtener el historial de compras' });
            res.json(resultados);
        });
    },

    // --- USUARIO / CLIENTE ---
    registrarUsuario: (req, res) => {
        Modelo.registrarUsuario(req.body, (error, resultado) => {
            if (error) return res.status(500).json({ error: 'Error al registrar el usuario' });
            res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: resultado.insertId });
        });
    },

    actualizarPerfil: (req, res) => {
        const { id } = req.params; // La identificación/ID que no cambia en la lógica de negocio principal
        Modelo.actualizarPerfilUsuario(id, req.body, (error, resultado) => {
            if (error) return res.status(500).json({ error: 'Error al actualizar el perfil' });
            res.json({ mensaje: 'Perfil actualizado con éxito (La identificación no fue alterada)' });
        });
    }
};

module.exports = bibliotecaControlador;
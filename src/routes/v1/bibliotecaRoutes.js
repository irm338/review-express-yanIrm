
const express = require('express');
const enrutador = express.Router();
const controlador = require('../../controllers/bibliotecaControlador');

// Rutas de Libros (Admin)
enrutador.post('/libros', controlador.crearLibro);
enrutador.get('/libros', controlador.listarLibros);
enrutador.get('/libros/buscar', controlador.buscarLibro);
enrutador.put('/libros/:id', controlador.actualizarLibro);
enrutador.delete('/libros/:id', controlador.eliminarLibro);

// Rutas de Préstamos
enrutador.post('/prestamos', controlador.prestarLibro);
enrutador.get('/prestamos/historial/:usuarioId', controlador.verHistorialPrestamos);

// Rutas de Ventas
enrutador.post('/ventas', controlador.realizarVenta);
enrutador.get('/ventas/historial/:usuarioId', controlador.verHistorialCompras);

// Rutas de Usuarios / Clientes
enrutador.post('/usuarios/registro', controlador.registrarUsuario);
enrutador.put('/usuarios/perfil/:id', controlador.actualizarPerfil);

module.exports = enrutador;
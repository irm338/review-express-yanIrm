const express = require('express');
const libroRoutes = require('./libroRoutes');
const prestamoRoutes = require('./prestamoRoutes');
const ventaRoutes = require('./ventaRoutes');
const usuarioRoutes = require('./usuarioRoutes');

const enrutador = express.Router();

// Reúne los recursos versionados bajo el prefijo /api/v1.
enrutador.get('/health', (req, res) => res.json({ estado: 'disponible' }));
enrutador.use('/libros', libroRoutes);
enrutador.use('/prestamos', prestamoRoutes);
enrutador.use('/ventas', ventaRoutes);
enrutador.use('/usuarios', usuarioRoutes);

module.exports = enrutador;

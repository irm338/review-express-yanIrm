
const express = require('express');
const router = express.Router();
const prestamoController = require('../../controllers/prestamoController');
const { validarPrestamoDto } = require('../../dtos/prestamoDto');
const { verificarAutenticacion, verificarAccesoUsuario } = require('../../middleware/authMiddleware');

router.post('/', verificarAutenticacion, verificarAccesoUsuario, validarPrestamoDto, prestamoController.prestarLibro);
router.get('/historial/:usuarioId', verificarAutenticacion, verificarAccesoUsuario, prestamoController.verHistorialPrestamos);

module.exports = router;
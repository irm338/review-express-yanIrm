
const express = require('express');
const router = express.Router();
const ventaController = require('../../controllers/ventaController');
const { validarVentaDto } = require('../../dtos/ventaDto');
const { verificarAutenticacion, verificarAccesoUsuario } = require('../../middleware/authMiddleware');

router.post('/', verificarAutenticacion, verificarAccesoUsuario, validarVentaDto, ventaController.realizarVenta);
router.get('/historial/:usuarioId', verificarAutenticacion, verificarAccesoUsuario, ventaController.verHistorialCompras);

module.exports = router;
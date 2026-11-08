
const express = require('express');
const router = express.Router();
const ventaController = require('../../controllers/ventaController');
const { verificarAutenticacion } = require('../../middleware/authMiddleware');

router.post('/', verificarAutenticacion, ventaController.realizarVenta);
router.get('/historial/:usuarioId', verificarAutenticacion, ventaController.verHistorialCompras);

module.exports = router;
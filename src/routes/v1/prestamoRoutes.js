
const express = require('express');
const router = express.Router();
const prestamoController = require('../../controllers/prestamoController');
const { verificarAutenticacion } = require('../../middleware/authMiddleware');

router.post('/', verificarAutenticacion, prestamoController.prestarLibro);
router.get('/historial/:usuarioId', verificarAutenticacion, prestamoController.verHistorialPrestamos);


module.exports = router;
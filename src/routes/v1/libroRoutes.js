
const express = require('express');
const enrutador = express.Router();
const libroController = require('../../controllers/libroController');
const { validarLibroDto } = require('../../dtos/libretoDto');
const { verificarAutenticacion, verificarRolAdmin } = require('../../middleware/authMiddleware');

// La consulta del catálogo es pública; su modificación requiere rol administrador.
enrutador.get('/buscar', libroController.buscarLibro);
enrutador.get('/', libroController.listarLibros);
enrutador.post('/', verificarAutenticacion, verificarRolAdmin, validarLibroDto, libroController.crearLibro);
enrutador.put('/:id', verificarAutenticacion, verificarRolAdmin, validarLibroDto, libroController.actualizarLibro);
enrutador.delete('/:id', verificarAutenticacion, verificarRolAdmin, libroController.eliminarLibro);

module.exports = enrutador;
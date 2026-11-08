
const express = require('express');
const enrutador = express.Router();
const libroController = require('../../controllers/libroController');
const { validarLibroDto } = require('../../dtos/libretoDto');

enrutador.post('/', validarLibroDto, libroController.crearLibro);
enrutador.get('/', libroController.listarLibros);
enrutador.put('/:id', validarLibroDto, libroController.actualizarLibro);
enrutador.delete('/:id', libroController.eliminarLibro);

module.exports = enrutador;
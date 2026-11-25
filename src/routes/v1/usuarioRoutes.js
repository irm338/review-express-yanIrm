const express = require('express');
const controlador = require('../../controllers/usuarioController');
const {
    verificarAutenticacion,
    verificarAccesoUsuario
} = require('../../middleware/authMiddleware');

const router = express.Router();

// Los endpoints de registro e inicio permiten crear la sesión; el perfil requiere autenticación.
router.post('/registro', controlador.registrarUsuario);
router.post('/login', controlador.iniciarSesion);
router.post('/logout', verificarAutenticacion, controlador.cerrarSesion);
router.get('/perfil/:id', verificarAutenticacion, verificarAccesoUsuario, controlador.verPerfil);
router.put('/perfil/:id', verificarAutenticacion, verificarAccesoUsuario, controlador.actualizarPerfil);

module.exports = router;

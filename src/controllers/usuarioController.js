const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModelo = require('../models/usuarioModel');
const { JWT_SECRETO, JWT_EXPIRACION, JWT_COOKIE_NAME, ENTORNO } = require('../config/env');

const crearCookie = (res, token) => {
    res.cookie(JWT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: ENTORNO === 'production',
        sameSite: 'strict',
        path: '/'
    });
};

const crearToken = (usuario) => jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    JWT_SECRETO,
    { expiresIn: JWT_EXPIRACION }
);

// Registra clientes y guarda únicamente el hash de su contraseña.
exports.registrarUsuario = async (req, res) => {
    const cuerpo = req.body && typeof req.body === 'object' ? req.body : {};
    const { identificacion, nombre, telefono, direccion, email, contrasena } = cuerpo;
    const correo = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (![identificacion, nombre, correo, contrasena].every((valor) => (
        typeof valor === 'string' && valor.trim().length > 0
    ))) {
        return res.status(400).json({
            error: 'Identificación, nombre, correo y contraseña son obligatorios.'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return res.status(400).json({ error: 'Indique una dirección de correo válida.' });
    }

    if (contrasena.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    try {
        const hash = await bcrypt.hash(contrasena, 12);
        const resultado = await UsuarioModelo.crear({
            identificacion: identificacion.trim(),
            nombre: nombre.trim(),
            telefono,
            direccion,
            email: correo,
            contrasena: hash
        });
        return res.status(201).json({
            mensaje: 'La cuenta se registró correctamente.',
            id: resultado.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Ya existe una cuenta con esa identificación o dirección de correo.'
            });
        }
        console.error('Error al registrar la cuenta:', error);
        return res.status(500).json({ error: 'No fue posible registrar la cuenta.' });
    }
};

// Comprueba las credenciales y entrega el JWT mediante cookie segura HttpOnly.
exports.iniciarSesion = async (req, res) => {
    const cuerpo = req.body && typeof req.body === 'object' ? req.body : {};
    const correo = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
    const contrasena = cuerpo.contrasena;
    if (!correo || typeof contrasena !== 'string') {
        return res.status(400).json({ error: 'Indique el correo y la contraseña.' });
    }

    try {
        const usuario = await UsuarioModelo.buscarPorEmail(correo);
        const contrasenaValida = usuario
            ? await bcrypt.compare(contrasena, usuario.contrasena)
            : false;
        if (!contrasenaValida) {
            return res.status(401).json({ error: 'El correo o la contraseña no son válidos.' });
        }

        crearCookie(res, crearToken(usuario));
        return res.json({
            mensaje: 'La sesión se inició correctamente.',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'No fue posible iniciar sesión.' });
    }
};

exports.cerrarSesion = (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME, {
        httpOnly: true,
        secure: ENTORNO === 'production',
        sameSite: 'strict',
        path: '/'
    });
    return res.json({ mensaje: 'La sesión se cerró correctamente.' });
};

exports.verPerfil = async (req, res) => {
    try {
        const usuario = await UsuarioModelo.buscarPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'No se encontró la cuenta solicitada.' });
        }
        return res.json(usuario);
    } catch (error) {
        console.error('Error al consultar el perfil:', error);
        return res.status(500).json({ error: 'No fue posible obtener el perfil.' });
    }
};

exports.actualizarPerfil = async (req, res) => {
    const cuerpo = req.body && typeof req.body === 'object' ? req.body : {};
    const { nombre, telefono, direccion, email } = cuerpo;
    const correo = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (typeof nombre !== 'string' || !nombre.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return res.status(400).json({ error: 'Indique un nombre y un correo válidos.' });
    }

    try {
        const resultado = await UsuarioModelo.actualizarPerfil(req.params.id, {
            nombre: nombre.trim(),
            telefono,
            direccion,
            email: correo
        });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró la cuenta solicitada.' });
        }
        return res.json({ mensaje: 'El perfil se actualizó correctamente.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ese correo ya está asociado a otra cuenta.' });
        }
        console.error('Error al actualizar el perfil:', error);
        return res.status(500).json({ error: 'No fue posible actualizar el perfil.' });
    }
};

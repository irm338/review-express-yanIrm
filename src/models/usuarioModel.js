const conexion = require('../config/db');

// Encapsula las consultas de usuarios; contraseñas nunca se exponen en búsquedas públicas.
const UsuarioModelo = {
    async crear(datos) {
        const [resultado] = await conexion.promise().execute(
            'INSERT INTO usuarios (identificacion, nombre, telefono, direccion, email, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                datos.identificacion,
                datos.nombre,
                datos.telefono || null,
                datos.direccion || null,
                datos.email,
                datos.contrasena,
                'cliente'
            ]
        );
        return resultado;
    },

    async buscarPorEmail(email) {
        const [usuarios] = await conexion.promise().execute(
            'SELECT id, identificacion, nombre, telefono, direccion, email, contrasena, rol FROM usuarios WHERE email = ? LIMIT 1',
            [email]
        );
        return usuarios[0] || null;
    },

    async buscarPorId(id) {
        const [usuarios] = await conexion.promise().execute(
            'SELECT id, identificacion, nombre, telefono, direccion, email, rol FROM usuarios WHERE id = ? LIMIT 1',
            [id]
        );
        return usuarios[0] || null;
    },

    async actualizarPerfil(id, datos) {
        const [resultado] = await conexion.promise().execute(
            'UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ?, email = ? WHERE id = ?',
            [datos.nombre, datos.telefono || null, datos.direccion || null, datos.email, id]
        );
        return resultado;
    }
};

module.exports = UsuarioModelo;

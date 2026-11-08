
const conexion = require('../config/db');

const UsuarioModelo = {
    crear: (datos, callback) => {
        const consulta = 'INSERT INTO usuarios (identificacion, nombre, telefono, direccion, email, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
        conexion.query(consulta, [
            datos.identificacion, 
            datos.nombre, 
            datos.telefono, 
            datos.direccion, 
            datos.email, 
            datos.contrasena, 
            datos.rol || 'cliente'
        ], callback);
    },

    buscarPorEmail: (email, callback) => {
        const consulta = 'SELECT * FROM usuarios WHERE email = ?';
        conexion.query(consulta, [email], callback);
    },

    buscarPorId: (id, callback) => {
        const consulta = 'SELECT id, identificacion, nombre, telefono, direccion, email, rol FROM usuarios WHERE id = ?';
        conexion.query(consulta, [id], callback);
    },

    actualizarPerfil: (id, datos, callback) => {
        // Nota: La identificación no se altera por seguridad de la lógica de negocio
        const consulta = 'UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ?, email = ? WHERE id = ?';
        conexion.query(consulta, [datos.nombre, datos.telefono, datos.direccion, datos.email, id], callback);
    }
};

module.exports = UsuarioModelo;
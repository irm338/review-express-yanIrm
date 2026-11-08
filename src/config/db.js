
const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./env');

const conexion = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

conexion.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos MySQL:', error);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

module.exports = conexion;
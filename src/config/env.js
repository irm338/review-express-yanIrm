const path = require('node:path');
const dotenv = require('dotenv');

// Carga el archivo de entorno de la raíz, sin reemplazar valores ya definidos.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRETO = process.env.JWT_SECRET;
if (!JWT_SECRETO) {
    throw new Error('Falta configurar JWT_SECRET en el archivo .env.');
}

module.exports = {
    PUERTO: Number.parseInt(process.env.PORT || '3000', 10),
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: Number.parseInt(process.env.DB_PORT || '3306', 10),
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'sistema_biblioteca',
    JWT_SECRETO,
    JWT_EXPIRACION: process.env.JWT_EXPIRES_IN || '1h',
    JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'token',
    ENTORNO: process.env.NODE_ENV || 'development'
};
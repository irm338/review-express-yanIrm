
const express = require('express');
const { PUERTO } = require('./src/config/env');
const { limitarPeticiones } = require('./src/middleware/rateLimitMiddleware');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(limitarPeticiones); // Aplicando limitación de peticiones

// Rutas con Versionado (v1)
const libroRoutes = require('./src/routes/v1/libroRoutes');
const prestamoRoutes = require('./src/routes/v1/prestamoRoutes'); // Asegúrate de tenerlo creado en su carpeta
const ventaRoutes = require('./src/routes/v1/ventaRoutes');       // Asegúrate de tenerlo creado en su carpeta

app.use('/api/v1/libros', libroRoutes);
// app.use('/api/v1/prestamos', prestamoRoutes);
// app.use('/api/v1/ventas', ventaRoutes);

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const { PUERTO } = require('./config/env');
const { limitarPeticiones } = require('./middleware/rateLimitMiddleware');
const rutasV1 = require('./routes/v1/bibliotecaRoutes');

const app = express();

// Configura el análisis del cuerpo, las cookies, Passport y el límite global.
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(limitarPeticiones);

// Mantiene los endpoints públicos bajo el prefijo versionado documentado.
app.use('/api/v1', rutasV1);

// Devuelve respuestas JSON en español también para rutas y errores inesperados.
app.use((req, res) => {
    res.status(404).json({ error: 'No se encontró el recurso solicitado.' });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    console.error('Error no controlado en la solicitud:', error);
    const codigo = error.status === 413 ? 413 : 400;
    const mensaje = codigo === 413
        ? 'El cuerpo de la solicitud supera el tamaño permitido.'
        : 'No fue posible procesar la solicitud.';
    return res.status(codigo).json({ error: mensaje });
});

// Al importar la aplicación para pruebas no se abre un puerto de escucha.
if (require.main === module) {
    app.listen(PUERTO, () => {
        console.log(`La API está escuchando en el puerto ${PUERTO}.`);
    });
}

module.exports = app;

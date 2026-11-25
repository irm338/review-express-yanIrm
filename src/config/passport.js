const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRETO, JWT_COOKIE_NAME } = require('./env');

// Acepta el JWT seguro de la cookie o el token Bearer de la cabecera.
const extraerToken = ExtractJwt.fromExtractors([
    (req) => req?.cookies?.[JWT_COOKIE_NAME] || null,
    ExtractJwt.fromAuthHeaderAsBearerToken()
]);

passport.use(new JwtStrategy({
    jwtFromRequest: extraerToken,
    secretOrKey: JWT_SECRETO
}, (carga, listo) => {
    // Los controladores reciben solo la identidad incluida en el token firmado.
    listo(null, carga);
}));

module.exports = passport;

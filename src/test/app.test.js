const test = require('node:test');
const assert = require('node:assert/strict');

// Proporciona una clave exclusiva de pruebas, sin depender de MySQL ni de archivos locales.
process.env.JWT_SECRET = 'clave-de-prueba-para-la-api';

const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../config/db');

let servidor;
let baseUrl;

test.before(async () => {
    servidor = app.listen(0);
    await new Promise((resolver) => servidor.once('listening', resolver));
    baseUrl = `http://127.0.0.1:${servidor.address().port}`;
});

test.after(async () => {
    await new Promise((resolver, rechazar) => {
        servidor.close((error) => (error ? rechazar(error) : resolver()));
    });
});

const tokenPara = (id, rol = 'cliente') => jwt.sign(
    { id, rol },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
);

test('expone el estado de la API bajo el prefijo versionado', async () => {
    const respuesta = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(respuesta.status, 200);
    assert.deepEqual(await respuesta.json(), { estado: 'disponible' });
});

test('devuelve los libros usando una base de datos simulada', async () => {
    const promesaOriginal = db.promise.bind(db);
    db.promise = () => ({
        execute: async () => [[{
            id: 1,
            titulo: 'Libro de prueba',
            autor: 'Autora',
            categoria: 'Novela',
            stock: 2,
            precio: '12.50'
        }], []]
    });

    try {
        const respuesta = await fetch(`${baseUrl}/api/v1/libros`);
        assert.equal(respuesta.status, 200);
        assert.equal((await respuesta.json())[0].titulo, 'Libro de prueba');
    } finally {
        db.promise = promesaOriginal;
    }
});

test('rechaza el historial si la solicitud no incluye una sesión válida', async () => {
    const respuesta = await fetch(`${baseUrl}/api/v1/prestamos/historial/1`);
    assert.equal(respuesta.status, 401);
    assert.match((await respuesta.json()).error, /sesión válida/);
});

test('impide consultar el historial de otra cuenta', async () => {
    const respuesta = await fetch(`${baseUrl}/api/v1/ventas/historial/2`, {
        headers: { authorization: `Bearer ${tokenPara(1)}` }
    });
    assert.equal(respuesta.status, 403);
    assert.match((await respuesta.json()).error, /permiso/);
});

test('valida el DTO del libro antes de consultar la base de datos', async () => {
    const respuesta = await fetch(`${baseUrl}/api/v1/libros`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${tokenPara(1, 'administrador')}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ titulo: '', autor: 'Autora', stock: -1, precio: 10 })
    });
    assert.equal(respuesta.status, 400);
    assert.match((await respuesta.json()).error, /obligatorios/);
});

test('rechaza los subtotales de venta que no suman el total declarado', async () => {
    const respuesta = await fetch(`${baseUrl}/api/v1/ventas`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${tokenPara(1)}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            usuario_id: 1,
            total: 15,
            libros: [{ libro_id: 1, cantidad: 1, subtotal: 10 }]
        })
    });
    assert.equal(respuesta.status, 400);
    assert.match((await respuesta.json()).error, /coincidir/);
});

test('confirma una venta completa con la conexión de base de datos simulada', async () => {
    const promesaOriginal = db.promise.bind(db);
    let ventaConfirmada = false;
    let conexionLiberada = false;
    db.promise = () => ({
        getConnection: async () => ({
            beginTransaction: async () => {},
            execute: async (consulta) => (
                consulta.includes('INSERT INTO ventas')
                    ? [{ insertId: 25 }, []]
                    : [{ affectedRows: 1 }, []]
            ),
            commit: async () => { ventaConfirmada = true; },
            rollback: async () => {},
            release: () => { conexionLiberada = true; }
        })
    });

    try {
        const respuesta = await fetch(`${baseUrl}/api/v1/ventas`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${tokenPara(7)}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                usuario_id: 7,
                total: 25,
                libros: [{ libro_id: 3, cantidad: 2, subtotal: 25 }]
            })
        });
        assert.equal(respuesta.status, 201);
        assert.equal((await respuesta.json()).venta_id, 25);
        assert.equal(ventaConfirmada, true);
        assert.equal(conexionLiberada, true);
    } finally {
        db.promise = promesaOriginal;
    }
});

test('acepta el JWT transportado en la cookie HttpOnly', async () => {
    const promesaOriginal = db.promise.bind(db);
    db.promise = () => ({ execute: async () => [[], []] });

    try {
        const respuesta = await fetch(`${baseUrl}/api/v1/ventas/historial/7`, {
            headers: { cookie: `token=${tokenPara(7)}` }
        });
        assert.equal(respuesta.status, 200);
        assert.deepEqual(await respuesta.json(), []);
    } finally {
        db.promise = promesaOriginal;
    }
});

test('responde en español al superar el límite de solicitudes', async () => {
    const respuestas = await Promise.all(
        Array.from({ length: 101 }, () => fetch(`${baseUrl}/api/v1/health`))
    );
    const respuestaLimitada = respuestas.find((respuesta) => respuesta.status === 429);

    assert.ok(respuestaLimitada, 'al menos una solicitud debe recibir el estado 429');
    assert.match((await respuestaLimitada.json()).error, /demasiadas solicitudes/i);
});

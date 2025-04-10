// app.js
const express = require('express');
const app = express();

// Middleware para JSON
app.use(express.json());

// Rutas GET
const rutasGET = require('./routes/get');
app.use('/proyectos', rutasGET);

// Rutas POST
const rutasPOST = require('./routes/post');
app.use('/post', rutasPOST);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a Pegasus Server!');
});

module.exports = app;

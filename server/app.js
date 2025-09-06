// app.js
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

// Middleware para JSON
app.use(express.json());
app.use('/public',express.static(path.join(__dirname, './public')));
app.use(cors({
    origin: "*"  // ejemplo: si sirves el HTML desde Live Server en VSCode
}));

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

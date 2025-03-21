const express = require("express");
const cors = require("cors");
const path = require('path')

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/public',express.static(path.join(__dirname, '../public')));

// Rutas
app.get("/", (req, res) => {
    res.json({ message: "¡Bienvenido a la API!" });
});

// Rutas
app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/page.html'));
});

module.exports = app;

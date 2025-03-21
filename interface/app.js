const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
    res.json({ message: "¡Bienvenido a la API!" });
});

module.exports = app;

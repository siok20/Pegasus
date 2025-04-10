// routes/post.js
const express = require('express');
const router = express.Router();

// Simulamos una "base de datos" temporal en memoria
let data = [];

// POST crea nueva data
router.post('/', (req, res) => {
  const nuevoProyecto = req.body;

  if (!nuevoProyecto.nombre) {
    return res.status(400).json({ error: 'Falta el campo nombre' });
  }

  data.push(nuevoProyecto);
  res.status(201).json(nuevoProyecto);
});

module.exports = router;

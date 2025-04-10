// routes/get.js
const express = require('express');
const router = express.Router();

// Datos a mostrar
let data = {"data":5};

// GET lista toda la data
router.get('/', (req, res) => {
    res.json(data);
});

module.exports = router;

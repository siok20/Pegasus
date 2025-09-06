// routes/get.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Carpeta donde tienes los CSV
const CSV_DIR = path.join(__dirname, '../.');

// INTERFAZ
router.get("/pegasus", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// GET -> lista todos los archivos CSV
router.get('/', (req, res) => {
    fs.readdir(CSV_DIR, (err, files) => {
        if (err) {
            console.error("Error leyendo la carpeta:", err);
            return res.status(500).json({ error: "Error leyendo la carpeta" });
        }

        const csvFiles = files.filter(file => path.extname(file) === '.csv');

        res.json({ data: csvFiles });
    });
});

//  Previsualizar CSV (primeras 10 líneas)
router.get("/preview/:file", (req, res) => {
    const filePath = path.join(CSV_DIR, req.params.file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Archivo no encontrado");
    }

    const content = fs.readFileSync(filePath, "utf8");
    const preview = content.split("\n").slice(0, 10)
    res.json({ preview });
});

// ⬇Descargar CSV
router.get("/download/:file", (req, res) => {
    const filePath = path.join(CSV_DIR, req.params.file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Archivo no encontrado");
    }

    res.download(filePath); // fuerza descarga
});


module.exports = router;

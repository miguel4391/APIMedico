const express = require('express');
const router = express.Router();
const permitirEndpoint = require('../middleware/autorizacao');
const db = require('../db/connection');
const logger = require('../utils/logger'); // Importar logger

router.get('/', permitirEndpoint('medicos'), async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM medicos_lst;');
        res.json(rows);
    } catch (err) {
        // Usa o logger para registar a exceção de base de dados no ficheiro
        logger.error('Erro na consulta de médicos na BD', { erro: err.message, stack: err.stack });
        res.status(500).json({ erro: 'Erro ao consultar dados' });
    }
});

module.exports = router;
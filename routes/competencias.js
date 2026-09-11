const express = require('express');
const router = express.Router();
const permitirEndpoint = require('../middleware/autorizacao');
const db = require('../db/connection');

router.get('/', permitirEndpoint('competencias'), async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM competencias_ativas_lst;');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao consultar dados' });
    }
});

module.exports = router;
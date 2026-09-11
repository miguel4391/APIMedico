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

// PUT /api/medicos/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const novosDados = req.body;
    const utilizadorQueAlterou = req.usuario?.id || req.headers['x-user-id'] || 'ADMIN';

    try {
        // 1. Obter estado anterior para auditoria
        const [medicoAtual] = await db.execute('SELECT * FROM medicos WHERE id = ?', [id]);
        if (medicoAtual.length === 0) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        // 2. Executar a alteração na BD
        await db.execute(
            'UPDATE medicos SET nome = ?, regiao = ? WHERE id = ?',
            [novosDados.nome, novosDados.regiao, id]
        );

        // 3. Registar Auditoria (executado em background se AUDIT_LOGS_ENABLED=true)
        registarAuditoria({
            utilizadorId: utilizadorQueAlterou,
            ip: req.ip,
            metodo: 'PUT',
            endpoint: req.originalUrl,
            dadosAnteriores: medicoAtual[0],
            dadosNovos: novosDados
        });

        res.json({ mensagem: 'Médico atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao atualizar médico' });
    }
});

module.exports = router;
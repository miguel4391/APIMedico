// utils/auditLogger.js
const db = require('../db/connection');
const logger = require('./logger'); // Winston para capturar erros de escrita na BD

async function registarAuditoria({ utilizadorId, ip, metodo, endpoint, dadosAnteriores = null, dadosNovos = null }) {
    // 1. Verifica se a funcionalidade está ligada no .env
    if (process.env.AUDIT_LOGS_ENABLED !== 'true') {
        return; // Sai sem fazer nada
    }

    try {
        const query = `
            INSERT INTO audit_logs 
            (utilizador_id, utilizador_ip, metodo, endpoint, dados_anteriores, dados_novos) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            utilizadorId || 'ANONYMOUS',
            ip,
            metodo,
            endpoint,
            dadosAnteriores ? JSON.stringify(dadosAnteriores) : null,
            dadosNovos ? JSON.stringify(dadosNovos) : null
        ];

        await db.execute(query, values);
    } catch (err) {
        // Regista a falha no Winston sem derrubar a API
        logger.error('Erro ao gravar log de auditoria na MariaDB', { erro: err.message });
    }
}

module.exports = registarAuditoria;
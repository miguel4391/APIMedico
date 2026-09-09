const db = require('../db/connection');

function logAuditoria(req, res, next) {
    const inicio = Date.now();

    // 'finish' dispara quando a resposta é enviada, com o status já definido
    res.on('finish', async () => {
        const tempoResposta = Date.now() - inicio;
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
            .split(',')[0].trim().replace('::ffff:', '');

        try {
            await db.execute(
                `INSERT INTO logs_acessos_apiMedicos (cliente, ip_origem, endpoint, metodo, status_resposta, tempo_resposta_ms)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    req.cliente ? req.cliente.nome : null,
                    ip,
                    req.originalUrl,
                    req.method,
                    res.statusCode,
                    tempoResposta
                ]
            );
        } catch (err) {
            // Nunca deixes o log falhar a interromper o pedido do cliente
            console.error('Erro ao gravar log de auditoria:', err.message);
        }
    });

    next();
}

module.exports = logAuditoria;
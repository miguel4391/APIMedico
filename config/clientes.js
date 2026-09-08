const db = require('../db/connection');

let cache = null;
let ultimaAtualizacao = 0;
const TTL_CACHE_MS = 5 * 60 * 1000; // 5 minutos

async function carregarClientes() {
    const agora = Date.now();

    // Reutiliza cache se ainda for válido
    if (cache && (agora - ultimaAtualizacao) < TTL_CACHE_MS) {
        return cache;
    }

    const [rows] = await db.execute(
        'SELECT nome, apiKey, ipsPermitidos, endpointsPermitidos FROM clientes_api WHERE ativo = 1'
    );

    const clientes = {};
    for (const row of rows) {
        clientes[row.nome] = {
            apiKey: row.apiKey,
            // mysql2 já faz parse automático de colunas JSON, mas garante com fallback
            ipsPermitidos: typeof row.ipsPermitidos === 'string' ? JSON.parse(row.ipsPermitidos) : row.ipsPermitidos,
            endpointsPermitidos: typeof row.endpointsPermitidos === 'string' ? JSON.parse(row.endpointsPermitidos) : row.endpointsPermitidos
        };
    }

    cache = clientes;
    ultimaAtualizacao = agora;
    return clientes;
}

// Força recarregar na próxima chamada (útil depois de adicionares/editares um cliente)
function invalidarCache() {
    cache = null;
}

module.exports = { carregarClientes, invalidarCache };
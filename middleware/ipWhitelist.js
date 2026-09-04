// middleware/ipWhitelist.js
const clientes = require('../config/clientes');

function ipWhitelist(req, res, next) {
    // Se estiveres atrás de um proxy/nginx, usa 'x-forwarded-for'
    const ipCliente = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
        .split(',')[0]
        .trim()
        .replace('::ffff:', ''); // remove prefixo IPv6-mapped-IPv4 se existir

    // Verifica se algum cliente configurado tem este IP na whitelist
    const clienteEncontrado = Object.entries(clientes).find(
        ([, config]) => config.ipsPermitidos.includes(ipCliente)
    );

    if (!clienteEncontrado) {
        console.warn(`Acesso negado - IP não autorizado: ${ipCliente}`);
        return res.status(403).json({ erro: 'IP não autorizado' });
    }

    // Guarda o nome do cliente identificado por IP para usar depois na autenticação
    req.clienteIdentificadoPorIp = clienteEncontrado[0];
    next();
}

module.exports = ipWhitelist;
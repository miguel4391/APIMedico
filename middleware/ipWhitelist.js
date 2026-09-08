const { carregarClientes } = require('../config/clientes');

async function ipWhitelist(req, res, next) {
    const ipCliente = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
        .split(',')[0]
        .trim()
        .replace('::ffff:', ''); // remove prefixo IPv6-mapped-IPv4 se existir

    const clientes = await carregarClientes();

    const clienteEncontrado = Object.entries(clientes).find(
        ([, config]) => config.ipsPermitidos.includes(ipCliente)
    );

    if (!clienteEncontrado) {
        console.warn(`Acesso negado - IP não autorizado: ${ipCliente}`);
        return res.status(403).json({ erro: 'IP não autorizado' });
    }

    req.clienteIdentificadoPorIp = clienteEncontrado[0];
    next();
}

module.exports = ipWhitelist;
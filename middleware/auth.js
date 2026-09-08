const { carregarClientes } = require('../config/clientes');

async function autenticar(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    console.log(`API Key recebida: ${apiKey}`); // Log da API Key recebida
    if (!apiKey) {
        return res.status(401).json({ erro: 'API Key em falta' });
    }

    const clientes = await carregarClientes();

    const entrada = Object.entries(clientes).find(
        ([, config]) => config.apiKey === apiKey
    );

    if (!entrada) {
        return res.status(401).json({ erro: 'API Key inválida' });
    }

    const [nomeCliente, config] = entrada;

    if (req.clienteIdentificadoPorIp && req.clienteIdentificadoPorIp !== nomeCliente) {
        console.warn(`API Key não corresponde ao IP de origem`);
        return res.status(403).json({ erro: 'Credenciais inconsistentes' });
    }

    req.cliente = { nome: nomeCliente, ...config };
    next();
}

module.exports = autenticar;
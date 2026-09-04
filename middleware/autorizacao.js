// middleware/autorizacao.js
function permitirEndpoint(nomeEndpoint) {
    return (req, res, next) => {
        if (!req.cliente.endpointsPermitidos.includes(nomeEndpoint)) {
            return res.status(403).json({ erro: 'Sem permissão para este recurso' });
        }
        next();
    };
}

module.exports = permitirEndpoint;
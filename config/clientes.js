// config/clientes.js
module.exports = {
    'localhost': {
        apiKey: '9c5942ea-f1bc-45b2-9cc4-f2ed63254967',
        ipsPermitidos: ['127.0.0.1', '::1'],
        endpointsPermitidos: ['medicos', 'especialidades']
    },
    'entidade_b': {
        apiKey: 'outra_chave_secreta_diferente',
        ipsPermitidos: ['0.0.0.0'],
        endpointsPermitidos: ['medicos']
    }
};
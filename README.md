# API Exportação dados dos Médicos

API Node.js para:

1. Receber pedidos Externos (para já só funciona em localhost)
2. Verificar se o IP está na Whitelist de IPs
3. Criar um Rate Limit para evitar o overload de pedidos
4. Verifica a autenticação (por chave de API)
5. Verifica a que endpoints está autorizado
6. Faz query à BD e devolve os dados


## Requisitos

- Node.js 20+ recomendado
- MySQL
- Nginx 1.28 + recomendado


## Execução

node app.js (temporario pois será para criar um deamon para gerir o serviço)



## Testes (em localhost)

curl http://127.0.0.1:3000/api/medicos -H "X-API-Key: 9c5942ea-f1bc-45b2-9cc4-f2ed63254967"
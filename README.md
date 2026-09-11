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



## Testes (pelo IP público da OM)

curl https://apimedicos.ordemdosmedicos.pt/api/medicos -H "X-API-Key: 9c5942ea-f1bc-45b2-9cc4-f2ed63254967"

## Funcionamento

1. Um pedido chega pela internet ao Cloudflare
2. O Cloudflare verifica se o IP consta dos IPs autorizados e se for, encaminha para o NodeJS na porta 3000
3. Por questões de segurança, só podem ser feitos 100 pedidos a cada 15 minutos. Evitamos overflow de pedidos
4. O NodeJs carrega em cache (5 minutos) os clientes verifica se o IP de origem do pedido está autorizado a fazer pedidos na API
5. O NodeJs verifica se a APIKey indicada pertence ao IP que fez o pedido
6. Caso o IP e a APIKey sejam autorizados a fazer requests ao endpoint solicitado, o pedido é feito à BD
7. É enviado um json com a resposta obtida na query à BD



## Adicionar Clientes da API
1. Solicitar que o IP seja acrescentado na whitelist da Cloudflare
2. Gerar uma chave guid
3. Registar os dados do cliente na tabela clientes_api, tanto na BD OM como na OM_testes (Registar o nome, a apiKey(chave guid gerada) IP do cliente e endPoints permitidos)

## Adicionar EndPoint
1. Criar uma nova rota
2. Adicionar a nova rota em app.js na zona das rotas
2. Criar a view pretendida no MySQL
3. chamar a view do MySQL. 
4. Adicionar na tabela clientes_api o registo dos clientes que podem aceder, tanto na BD OM como na OM_testes



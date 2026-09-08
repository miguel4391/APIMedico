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

## Funcionamento

1. Um pedido chega pela internet ao Nginx
2. Se for pot HTTP, por proxy interno é encaminhado para HTTPS
3. O Nginx verifica se o IP consta dos IPs autorizados e se for, encaminha para o NodeJS na porta 3000
4. Por questões de segurança, só podem ser feitos 100 pedidos a cada 15 minutos. Evitamos overflow de pedidos
5. O NodeJs carrega em cache (5 minutos) os clientes verifica se o IP de origem do pedido está autorizado a fazer pedidos na API
6. O NodeJs verifica se a APIKey indicada pertence ao IP que fez o pedido
7. Caso o IP e a APIKey sejam autorizados a fazer requests ao endpoint solicitado, o pedido é feito à BD
8. É enviado um json com a resposta obtida na query à BD


## Adicionar passagem na Firewall (ufw)
sudo ufw allow from <IP Externo> to any port 80
sudo ufw allow from <IP Externo> to any port 443

## TODO
Quando tivermos pedidos a serem rececionados do exterior, correr estes comandos:
1. sudo ufw delete 4
2. sudo ufw delete 2
3. sudo ufw allow from <IP Externo> to any port 80
4. sudo ufw allow from <IP Externo> to any port 443
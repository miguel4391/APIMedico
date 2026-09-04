// app.js
require("dotenv").config();

const express = require('express');
const helmet = require('helmet');
const ipWhitelist = require('./middleware/ipWhitelist');
const autenticar = require('./middleware/auth');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

app.set('trust proxy', 'loopback'); // se estiveres atrás de Nginx/proxy
app.use(helmet());            // headers de segurança básicos
app.use(express.json());
app.use(rateLimiter);
app.use(ipWhitelist);
app.use(autenticar);

// Rotas
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/especialidades', require('./routes/especialidades'));

app.listen(3000, () => console.log('API a correr na porta 3000'));
require("dotenv").config();

const express = require('express');
const helmet = require('helmet');
const ipWhitelist = require('./middleware/ipWhitelist');
const autenticar = require('./middleware/auth');
const rateLimiter = require('./middleware/rateLimiter');
const logAuditoria = require('./middleware/logAuditoria');
const logger = require('./utils/logger');

// 1. Inicializar a aplicação Express
const app = express();

app.set('trust proxy', 'loopback');

// 2. Middleware de Logs HTTP (tem de vir LOGO A SEGUIR ao app)
app.use((req, res, next) => {
    const inicio = Date.now();

    res.on('finish', () => {
        const duracao = Date.now() - inicio;
        const mensagem = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duracao}ms`;

        const dadosExtra = {
            metodo: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            ip: req.ip || req.socket.remoteAddress,
            duracaoMs: duracao
        };

        if (res.statusCode >= 500) {
            logger.error(mensagem, dadosExtra);
        } else if (res.statusCode >= 400) {
            logger.warn(mensagem, dadosExtra);
        } else {
            logger.info(mensagem, dadosExtra);
        }
    });

    next();
});

// 3. Outros Middlewares
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);
app.use(ipWhitelist);
app.use(autenticar);
app.use(logAuditoria);

// 4. Rotas
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/medico', require('./routes/medicos'));
app.use('/api/especialidades', require('./routes/especialidades'));
app.use('/api/subespecialidades', require('./routes/subespecialidades'));
app.use('/api/competencias', require('./routes/competencias'));

// Rota de teste para verificar se o servidor está a funcionar
app.get('/', (req, res) => {
    res.send('Servidor API Médico a correr!');
});
// 5. Arranque do Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Servidor API Médico a correr na porta ${PORT}`);
});
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,                  // máx 100 pedidos por IP nesse período
    message: { erro: 'Demasiados pedidos, tenta novamente mais tarde' },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = limiter;
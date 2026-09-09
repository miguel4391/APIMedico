// utils/logger.js
const winston = require('winston');
require('winston-daily-rotate-file');

const transporteFicheiro = new winston.transports.DailyRotateFile({
    filename: 'logs/api-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d'   // mantém só os últimos 30 dias
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        transporteFicheiro,
        new winston.transports.Console()
    ]
});

module.exports = logger;
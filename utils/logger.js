// utils/logger.js
const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logPath = path.join(__dirname, '../logs/api-%DATE%.log');

console.log('>>> O CAMINHO ABSOLUTO DOS LOGS É:', logPath); // <--- Adicione esta li

const transporteFicheiro = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '../logs/api-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d'
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
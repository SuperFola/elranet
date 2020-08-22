const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] [${level}] : ${message}`;
                })
            )
        })
    ]
});

module.exports = logger;

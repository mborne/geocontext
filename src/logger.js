import winston from 'winston';

const LOG_LEVEL = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

const formats = {
    json: winston.format.json(),
    simple: winston.format.simple()
};
const LOG_FORMAT = process.env.LOG_FORMAT ? process.env.LOG_FORMAT : 'simple';
if ( ! Object.keys(formats).includes(LOG_FORMAT) ){
    throw new Error(`LOG_FORMAT=${LOG_FORMAT} not found!`);
}

const format = formats[LOG_FORMAT];

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: format,
    transports: [
        new winston.transports.Console()
    ],
});

logger.info(`LOG_FORMAT=${LOG_FORMAT}, LOG_LEVEL=${LOG_LEVEL}`);
export default logger;


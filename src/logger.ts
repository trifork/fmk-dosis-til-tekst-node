import pino from 'pino';

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss,l'
        }
    },
    level: 'info'
});

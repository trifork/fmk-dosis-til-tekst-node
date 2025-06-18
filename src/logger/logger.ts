// import pino from 'pino';
// import { getRequestContext } from './requestContext';

// export const logger = pino({
//     transport: {
//         target: './pino-pretty-transport',
//         options: {
//             translateTime: 'SYS:yyyy-mm-dd HH:MM:ss,l'
//         }
//     },
//     level: 'info'
// });


import pino from 'pino';
import { createPrettyStream } from './pinoPrettyTransport';
import { getRequestContext } from './requestContext'; // Optional: for requestId support

export const logger = pino(
    {
        mixin() {
            const context = getRequestContext();
            return { requestId: context?.requestId || '-' };
        },
    },
    createPrettyStream()
);


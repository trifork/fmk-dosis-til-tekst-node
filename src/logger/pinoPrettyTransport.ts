import pino from 'pino';
import { Transform, TransformCallback } from 'stream';
import { format } from 'date-fns';

export function createPrettyStream() {
    const stream = new Transform({
        objectMode: true,
        transform(chunk: any, _encoding: BufferEncoding, callback: TransformCallback) {
            try {
                // In case chunk comes as a string (shouldn't in objectMode, but can)
                const log = typeof chunk === 'string' ? JSON.parse(chunk) : chunk;
                
                const time = format(new Date(log.time), "yyyy-MM-dd HH:mm:ss,SSS");
                const level = getLevelLabel(log.level);
                const requestId = log.requestId || '-';
                const message = log.msg || '';

                const line = `${time} [${level}] [${requestId}] ${message}\n`;
                callback(null, line);
            } catch (err) {
                callback(null, `LOG_PARSE_ERROR ${err instanceof Error ? err.message : err}\n`);
            }
        },
    });

    // Pipe to stdout so logs are displayed
    stream.pipe(process.stdout);

    return stream;
}

function getLevelLabel(level: number): string {
    return pino.levels.labels[level].toUpperCase();
}
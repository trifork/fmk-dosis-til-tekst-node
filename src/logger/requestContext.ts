import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { Request } from 'express';

type RequestContext = {
    requestId: string;
};

const storage = new AsyncLocalStorage<RequestContext>();

export function withRequestContext<T>(req: Request, fn: () => T): T {
    const requestId = req.headers['x-request-handle']?.toString() || randomId();
    return storage.run({ requestId }, fn);
}

export function getRequestContext(): RequestContext | undefined {
    return storage.getStore();
}

function randomId(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        result += chars[randIndex];
    }

    return result;
}

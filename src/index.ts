import express, { Application, json, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { ValidateError } from 'tsoa';
import { RegisterRoutes } from "../target/routes";
import { logger } from './logger/logger';
import { calcETag } from './controllers/eTagUtil';
import { rerouteGetToPost } from './controllers/rerouteGetToPost';
import { withRequestContext } from './logger/requestContext';

const PORT = process.env.PORT || 8000;

// use express.js
const app: Application = express();

app.set('etag', false); // Disable Express default ETag generation - we make our own

app.use(express.json({ limit: '20mb' }));

const ETAG = calcETag();

app.use((req, _res, next) => {
    withRequestContext(req, () => next());
});

// add middleware for logging every request
const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`Request received: ${req.method} ${req.path}`);
    next();
};
app.use(requestLogger);

app.use(json());

// ETag handling: only apply to GET requests
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();

    const clientETag = req.headers['if-none-match'];

    if (clientETag === ETAG) {
        res.status(304).end();
    } else {
        res.locals.etag = ETAG;
        next();
    }
});

const PATHS_TO_REROUTE_FROM_GET_TO_POST = new Set([
    '/convertCombined',
    '/convertLongText',
    '/convertShortText',
    '/getDosageType',
    '/getDosageType144',
    '/calculateDailyDosis',
    '/getShortTextConverterClassName',
    '/getLongTextConverterClassName'
]);

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET" && PATHS_TO_REROUTE_FROM_GET_TO_POST.has(req.path)) {
        rerouteGetToPost(req, res, next);
    } else {
        next();
    }
});

// Middleware: attach ETag and Cache-Control to response
app.use((req: Request, res: Response, next: NextFunction) => {
    if (res.locals.etag) {
        const originalSend = res.send;
        res.send = function (body: any): Response {
            if (res.statusCode < 300) {
                res.set('ETag', res.locals.etag);
                res.set('Cache-Control', 'public, max-age=1800');
            }
            return originalSend.call(this, body);
        };
    }

    next();
});

// Register TSOA routes
RegisterRoutes(app);

app.use(function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof ValidateError) {
        logger.warn(`Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}. ${dumpBodyAndParams(req)}`);
        res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    } else if (err instanceof Error) {
        logger.error(err.stack, dumpBodyAndParams(req));
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

function dumpBodyAndParams(req: Request) {
    const body = req.body;
    let bodyText;
    switch (typeof body) {
        case 'string':
            bodyText = body;
            break;
        case 'object':
            bodyText = JSON.stringify(body);
            break;
        default:
            bodyText = "";
            break;
    }

    const urlParams = Object.entries(req.query).map(([k, v]) => `${k}=${String(v)}`).join("&");
    return `Request data was: ${req.method} ${req.path} ${urlParams} ${bodyText}`;

}

// add swagger api documentation
const swaggerDocument = require('../target/generated-sources/openapi/swagger.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
    process.on(signal, () => {
        logger.info(`Received ${signal}, terminating`);
        process.exit();
    })
);

// start server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});


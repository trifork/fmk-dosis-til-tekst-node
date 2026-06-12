import express, { type Application, json, type NextFunction, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { DosisTilTekstException } from 'fmk-dosis-til-tekst-ts';
import { ValidateError } from 'tsoa';
import { RegisterRoutes } from "./generated/routes.js";
import { calcETag } from './controllers/eTagUtil.js';
import { rerouteGetToPost } from './controllers/rerouteGetToPost.js';
import { logger } from './logger/logger.js';
import { withRequestContext } from './logger/requestContext.js';

import qs from 'qs';
import { readFileSync } from 'fs';

const PORT = process.env.PORT || 8000;

// use express.js
const app: Application = express();

// app.set("query parser", (str: string) => {
//     // Encode literal '+' as %2B so qs doesn't convert them to spaces
//     const safe = str.replace(/\+/g, "%2B");
//     return qs.parse(safe);
// });

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

app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode === 404) {
            logger.warn(`Sending 404 Not Found, method=${req.method}, url=${req.originalUrl}`);
        }
    });

    next();
});

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

const PATHS_TO_REROUTE_FROM_GET_TO_POST_LEGACY = new Set([
    '/convertCombined',
    '/convertLongText',
    '/convertShortText',
    '/getDosageType',
    '/getDosageType144',
    '/calculateDailyDosis',
    '/getShortTextConverterClassName',
    '/getLongTextConverterClassName'
]);

const PATHS_TO_REROUTE_FROM_GET_TO_POST = new Set([
    '/renderDosageCombined',
    '/renderDosage'
]);

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET" && PATHS_TO_REROUTE_FROM_GET_TO_POST_LEGACY.has(req.path)) {
        rerouteGetToPost(req, res, true, next);
    } else if (req.method === "GET" && PATHS_TO_REROUTE_FROM_GET_TO_POST.has(req.path)) {
        rerouteGetToPost(req, res, false, next);
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
    if (err instanceof DosisTilTekstException) {
        res.status(400).json({
            message: err.message
        })
    } else if (err instanceof ValidateError) {
        logger.warn(`Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}. ${dumpBodyAndParams(req)}`);
        res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    } else {
        if (err instanceof Error) {
            logger.error(err.stack, dumpBodyAndParams(req));
        } else {
            logger.error("Unexpected error, err=" + JSON.stringify(err));
        }
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

import swaggerDocument from "./generated/swagger.json" with { type: "json" };
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

import express, { Application, json, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

// import Router from './routes';
import { ValidateError } from 'tsoa';
import { RegisterRoutes } from "../target/routes";
import { logger } from './logger/logger';

const PORT = process.env.PORT || 8000;

// use express.js
const app: Application = express();

app.use(express.json({ limit: '20mb' }));


// add middleware for logging every request
const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
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

    // logger.info(`Request received: ${req.method} ${req.path}`);
    const urlParams = Object.entries(req.query).map(([k, v]) => `${k}=${String(v)}`).join("&");
    logger.info(`Request received: ${req.method} ${req.path} ${urlParams} ${bodyText}`);
    next();
};
app.use(requestLogger);


// configure routing
app.use(json());

RegisterRoutes(app);

app.use(function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof ValidateError) {
        logger.warn(`Caught Validation Error for ${req.path}: ${JSON.stringify(err.fields)}`);
        res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    } else if (err instanceof Error) {
        logger.error(err.stack);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

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

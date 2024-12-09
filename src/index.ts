import 'express-async-errors';
import express, {Application} from 'express';
import swaggerUi from 'swagger-ui-express';

import Router from './routes';
import {logger} from './logger/logger';

const PORT = process.env.PORT || 8000;

// use express.js
const app: Application = express();
app.use(express.json({limit: '20mb'}));


// add middleware for logging every request
const requestLogger = function (req: any, res: any, next: () => void) {
    logger.info('Request received: ' + req.path);
    next();
};
app.use(requestLogger);


// configure routing
app.use(Router);


// add middleware for logging every error
const errorLogger = function (err: any, req: any, res: any, next: () => void) {
    logger.error(err.stack);
    res.status(500).json({
        msg: err.message,
        success: false
    });
};
app.use(errorLogger);


// add swagger api documentation
const swaggerDocument = require('./swagger.json');
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

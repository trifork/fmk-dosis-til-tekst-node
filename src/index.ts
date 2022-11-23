import 'express-async-errors';
import express, {Application} from 'express';
import swaggerUi from 'swagger-ui-express';

import Router from './routes';
import {logger} from './logger';

const PORT = process.env.PORT || 8000;

// express.js
const app: Application = express();
app.use(express.json());

// logging every request with pino
const myLogger = function (req: any, res: any, next: () => void) {
    logger.info('Request received: ' + req.path);
    next();
};
app.use(myLogger);

// routing
app.use(Router);

// swagger
const swaggerDocument = require('./swagger.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});

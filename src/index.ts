import express, {Application} from 'express';
import swaggerUi from 'swagger-ui-express';

import Router from './routes';

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(Router);

const swaggerDocument = require('./swagger.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});

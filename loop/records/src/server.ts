import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './api';
import { logger } from './lib/logger';
import type { Server } from 'http';

export const app = express();
const port = process.env.PORT || 8787;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PFP2E Records API',
      version: '1.0.0',
      description: 'API for managing the verification lifecycle of PFP campaigns.',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/api.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());

// Serve the raw OpenAPI spec
app.get('/v1/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Serve Swagger docs
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
logger.info(`API documentation available at http://localhost:${port}/v1/docs`);

// Mount the API router
app.use('/v1', apiRouter);

let server: Server;

export function startServer(portNum = port): Server {
  server = app.listen(portNum, () => {
    logger.info(`Server is running on http://localhost:${portNum}`);
  });
  return server;
}

export function stopServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server && server.listening) {
      server.close((err) => {
        if (err) {
          logger.error('Failed to stop server:', err);
          return reject(err);
        }
        logger.info('Server stopped.');
        resolve();
      });
    } else {
      // If server is not running, resolve immediately.
      resolve();
    }
  });
}


// Only listen if the file is run directly
if (require.main === module) {
  startServer();
}

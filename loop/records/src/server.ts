import express from 'express';
import { apiRouter } from './api';
import { logger } from './lib/logger';
import type { Server } from 'http';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
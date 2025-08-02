import express from 'express';
import { apiRouter } from './api';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mount the API router
app.use('/v1', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import '@src/rpc';

import { PORT } from '@src/config';
import socket from '@src/socket';
import { verifyToken, logger } from '@src/middlewares';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(verifyToken);
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404);
  res.json({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.json({ msg: err.stack });
});

const server: http.Server = http.createServer(app);

server.listen(PORT, () => {
  (async () => {
    console.log(`* API Server Started at ${PORT}`);
    await createConnection();
    socket(server);
  })().catch(console.error);
});

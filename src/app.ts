import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import '@src/rpc';

import { PORT } from '@src/config';
import sockets from '@src/sockets';
import { consoleLogger, fileLogger } from '@src/utils/logger';
import validateHeader from '@src/middlewares/validate-header';
import routes from './routes';

const app = express();

app.set('port', PORT);

app.use(cors());
app.use(express.json());

app.use(consoleLogger);
app.use(fileLogger);

app.use(validateHeader);
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
    sockets(server);
  })().catch(console.error);
});

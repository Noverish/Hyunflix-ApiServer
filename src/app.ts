import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import 'reflect-metadata';

import { PORT } from '@src/config';
import { consoleLogger, fileLogger } from '@src/utils/logger';
import { initTypeORM } from '@src/entity';
import { validateToken } from '@src/middlewares/validate-token';
import routes from './routes';

const app = express();

app.set('port', PORT);

app.use(cors());
app.use(express.json());
app.use(consoleLogger);
app.use(fileLogger);
app.use(initTypeORM);
app.use(validateToken);
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404);
  res.json({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if(!res.finished) {
    res.status(500);
    res.end(JSON.stringify(err, Object.getOwnPropertyNames(err), 4));
  }
});

export const server: http.Server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`* API Server Started at ${PORT}`);
});

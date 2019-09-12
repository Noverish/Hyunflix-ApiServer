import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';

import { consoleLogger, fileLogger } from '@src/utils/logger';
import { initTypeORM } from '@src/entity';
import { validateToken } from '@src/server-api/routes/auth';
import routes from './routes';

const app = express();
const port = parseInt(process.env.PORT) || 80;

app.set('port', port);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

server.listen(port, () => {
  console.log(`API Server Started at ${port}`);
});

import * as ApiSocket from './sockets/api';
import * as FFmpegSocket from './sockets/ffmpeg';
ApiSocket.init();
FFmpegSocket.init();
import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';

import { consoleLogger, fileLogger } from '@src/utils/logger';
import { initTypeORM } from '@src/entity'
import movies from './routes/movies';
import auth, { validateToken } from './routes/auth';
import articles from './routes/articles';
import encode from './routes/encode';
import explorer from './routes/explorer';
import musics from './routes/musics';
import tvPrograms from './routes/tv-programs';

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
app.use('/auth', auth);
app.use('/articles', articles);
app.use('/movies', movies);
app.use('/encode', encode);
app.use('/explorer', explorer);
app.use('/musics', musics);
app.use('/tv-programs', tvPrograms);

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
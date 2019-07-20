import * as http from 'http';
import * as express from 'express';
import * as fs from 'fs';
import { createError } from './utils';

import { consoleLogger, fileLogger } from './utils/logger';
import auth from './routes/auth';
import archive from './routes/archive';

const app = express();
const port = 8080;

app.set('port', port);
app.set('case sensitive routing', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req['decodedPath'] = decodeURI(req.path);
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(consoleLogger);
app.use(fileLogger);

app.use('/auth', auth);
app.use('/archive', archive);

app.use((req, res, next) => {
  res.json(createError(404, 'Not Found'));
});

app.use((err, req, res, next) => {
  res.json(err);
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server Started at ${port}`);
});

server.on('error', (error) => {
  console.error(error);
});

import * as http from 'http';
import * as express from 'express';
import * as fs from 'fs'
import { createError } from './utils'

import logger from './utils/logger';
import AuthRouter from './routes/auth';
import ArchiveRouter from './routes/archive';

const app = express();
const port = 8080;

app.set('port', port);
app.set('case sensitive routing', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  req['decodedPath'] = decodeURI(req.path);
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(logger);

app.use('/auth', AuthRouter);
app.use('/archive', ArchiveRouter);

app.use(function(req, res, next) {
  res.json(createError(404, 'Not Found'));
})

app.use(function(err, req, res, next) {
  res.json(err);
})

const server = http.createServer(app);
server.listen(port, function() {
  console.log(`Server Started at ${port}`);
});

server.on('error', function onError(error) {
  console.error(error);
});


